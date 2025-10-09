import {useAtom} from "jotai/index";
import {
    currentPathAtom,
    dbAccessTokenAtom,
    filesAtom,
    foldersAtom,
    isAuthenticatedAtom,
    isLoadingAtom
} from "@/store/fileManagerAtoms";
import {useEffect, useRef, useState} from "react";
import {useRouter} from "next/router";

const useDropboxProvider = () => {
    const [isLoading, setIsLoading] = useAtom(isLoadingAtom);
    const [currentPath, setCurrentPath] = useAtom(currentPathAtom);
    const [folders, setFolders] = useAtom(foldersAtom);
    const [files, setFiles] = useAtom(filesAtom);
    const [isAuthenticated, setIsAuthenticated] = useAtom(isAuthenticatedAtom);
    const [appKey, setAppKey]: any = useState(process.env.NEXT_PUBLIC_DROPBOX_APP_KEY);
    const [appSecret, setAppSecret]: any = useState(process.env.NEXT_PUBLIC_DROPBOX_APP_SECRET);
    const [accessToken, setAccessToken] = useAtom(dbAccessTokenAtom);
    const [refreshToken, setRefreshToken] = useState("");

    const router = useRouter();
    const {code} = router.query;

    // ********************************************************************
    // Dropbox
    // ********************************************************************
    const dropboxFolderLinkInputRef: any = useRef(null);
    const dropboxFolderPasswordInputRef: any = useRef(null);

    const base64Token = Buffer.from(`${appKey}:${appSecret}`).toString("base64");
    const dbHeaders = {
        "Content-Type": "application/json",
        "Authorization": `Basic ${base64Token}`,
    }

    const [dropboxFolderLink, setDropboxFolderLink] = useState(null);
    const [dropboxFolderPassword, setDropboxFolderPassword] = useState(null);
    let dropboxPath = (currentPath.startsWith("Root"))
        ? currentPath.replace("Root", "")
        : currentPath;

    const handleDbFormSubmit = async (e: any) => {
        e.preventDefault();
        setIsAuthenticated(false);
        const newDropboxFolderLink = dropboxFolderLinkInputRef.current.value;
        const newDropboxFolderPassword = dropboxFolderPasswordInputRef.current.value;
        setDropboxFolderLink(newDropboxFolderLink);
        setDropboxFolderPassword(newDropboxFolderPassword);

        // manually call handleFetchDropbox function instead of using useEffect
        if (newDropboxFolderLink === dropboxFolderLink) await handleFetchDropbox();
    }

    const handleFetchDropbox = async () => {
        const apiUrl = "https://api.dropboxapi.com/2/files/list_folder";

        setIsLoading(true);
        console.log("Fetching dropbox folder contents...");

        try {
            const res: any = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    ...dbHeaders,
                    "Authorization": `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    path: dropboxPath,
                    ...(dropboxFolderLink !== null) && {
                        "shared_link": {
                            "url": dropboxFolderLink,
                        }
                    }
                }),
            })
            const data = await res.json();
            updateFolders(data?.entries);
            updateFiles(data?.entries);
        } catch (err) {
            console.log(err)
        }
        setIsLoading(false);
    }

    const updateFolders = (entries: Array<any>) => {
        let folders: any = [];
        entries?.map((entry: any) => {
            if (entry[".tag"] === "folder") {
                folders.push({
                    key: entry.id,
                    id: entry.id,
                    name: entry.name,
                    path: currentPath,
                })
            }
        });
        setFolders(folders);
    }

    const updateFiles = (entries: Array<any>) => {
        let files: any = [];
        entries?.map((entry: any) => {
            if (entry[".tag"] === "file") {
                files.push({
                    key: entry.id,
                    id: entry.id,
                    name: entry.name,
                    path: currentPath,
                })
            }
        });
        setFiles(files);
    }

    // authentication flow
    const getAccessToken = async (code: string) => {
        const apiUrl = `https://api.dropbox.com/oauth2/token`;
        try {
            const res = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({
                    "code": code,
                    "redirect_uri": process.env.NEXT_PUBLIC_SITE_URL,
                    "grant_type": "authorization_code",
                    "client_id": appKey,
                    "client_secret": appSecret,
                }),
            });
            const data = await res.json();
            console.log('Dropbox token response', data);
            const accessToken = data.access_token;
            const refreshToken = data.refresh_token;
            if(!accessToken || !refreshToken) return;
            setAccessToken(accessToken);
            setRefreshToken(refreshToken);
            setIsAuthenticated(true);
        }
        catch (err) {
            console.log(err);
            setIsAuthenticated(false);
        }
    }

    useEffect(() => {
        if (!code || !router.isReady) return;
        getAccessToken(code.toString());
    }, [code, router.isReady]);

    const handleDownloadDbFile = async ({fileId, fileName}: any) => {
        const apiUrl = `https://content.dropboxapi.com/2/files/download`;
        const res = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Dropbox-API-Arg": JSON.stringify({
                    "path": fileId,
                }),
            }
        })
            .then(res => res.blob())
            .then((res: any) => {
                console.log(res);
                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(res);
                link.download = fileName;
                link.click();
            });
    }

    const handleCreateDbFolder = async ({folderName}: any) => {
        const apiUrl = `https://api.dropboxapi.com/2/files/create_folder_v2`;
        const res = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "path": `${dropboxPath}/${folderName}`,
                "autorename": false,
            })
        })
            .then(res => res.json())
            .then(res => console.log(res));
    }

    const handleUploadFileToDb = async ({file, fileName}: any) => {
        const apiUrl = `https://content.dropboxapi.com/2/files/upload`;
        const res = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/octet-stream",
                "Authorization": `Bearer ${accessToken}`,
                "Dropbox-API-Arg": JSON.stringify({
                    autorename: false,
                    mode: "add",
                    "strict_conflict": false,
                    path: `${dropboxPath}/${fileName}`,
                })
            },
            body: file,
        });
    }

    return {
        appKey,
        dropboxFolderLinkInputRef,
        dropboxFolderPasswordInputRef,
        handleDbFormSubmit,
        handleFetchDropbox,
        handleDownloadDbFile,
        handleCreateDbFolder,
        handleUploadFileToDb,
    }
}
export default useDropboxProvider;
