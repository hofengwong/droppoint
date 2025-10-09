import {useEffect, useState} from "react";
import {useAtom, useAtomValue} from "jotai";
import {
    azureTokenAtom,
    currentPathAtom,
    filesAtom,
    foldersAtom,
    isAuthenticatedAtom,
    isLoadingAtom, spSiteUrlAtom
} from "@/store/fileManagerAtoms";

type HandleFetchSharepointProps = {
    fetchFolders?: boolean;
    fetchFiles?: boolean;
}

const useSharepointProvider = () => {
    const [isLoading, setIsLoading] = useAtom(isLoadingAtom);
    const [currentPath, setCurrentPath] = useAtom(currentPathAtom);
    const [folders, setFolders] = useAtom(foldersAtom);
    const [files, setFiles] = useAtom(filesAtom);
    const [isAuthenticated, setIsAuthenticated] = useAtom(isAuthenticatedAtom);

    // ******************************************************************
    // Sharepoint
    // ******************************************************************
    const [spSiteUrl, setSpSiteUrl] = useAtom(spSiteUrlAtom);
    const currentSpPath = currentPath.replace("Root/", "");
    const spAccessToken = useAtomValue(azureTokenAtom);
    const spHeaders = {
        "Accept": "application/json;odata=verbose",
        "Authorization": `Bearer ${spAccessToken}`,
    };
    const handleFetchSharepoint = async ({fetchFolders = true, fetchFiles = true}: HandleFetchSharepointProps = {}) => {
        console.log("Fetching Sharepoint folder contents...");
        setIsLoading(true);

        const currentRelativeUrl = (currentPath === "Root")
            ? ""
            : currentSpPath.replaceAll(" ", "");

        // get folders of current folder
        if (fetchFolders) {
            const apiUrl3 = `${spSiteUrl}/_api/web/GetFolderByServerRelativeUrl('${currentRelativeUrl}')/Folders`;
            const res3: any = await fetch(apiUrl3, {
                method: "GET",
                headers: spHeaders,
            })
                .then(res => res.json())
                .then(res => {
                    const entries = res?.d?.results;
                    const folders = entries?.map((entry: any) => ({
                        key: entry?.['UniqueId'],
                        id: entry?.['UniqueId'],
                        name: entry?.['Name'],
                        path: currentPath,
                    }));
                    setFolders(folders);
                })
                .catch(err => {
                    console.error("Error fetching Sharepoint folders:", err);
                });
        }

        // get files
        if (fetchFiles) {
            const apiUrl2 = `${spSiteUrl}/_api/web/GetFolderByServerRelativeUrl('${currentRelativeUrl}')/Files`;
            const res2: any = await fetch(apiUrl2, {
                method: "GET",
                headers: spHeaders,
            })
                .then(res => res.json())
                .then(res => {
                    const entries = res?.d?.results;
                    const files = entries?.map((entry: any) => ({
                        key: entry?.['UniqueId'],
                        id: entry?.['UniqueId'],
                        name: entry?.['Name'],
                        path: currentSpPath,
                    }));
                    setFiles(files);
                })
                .catch(err => {
                    console.error("Error fetching Sharepoint files:", err);
                });
        }

        setIsLoading(false);
    }

    const [formDigestValue, setFormDigestValue] = useState("");
    const handleGetFormDigestValue = async () => {
        let apiUrl = `${spSiteUrl}/_api/contextinfo`;
        try {
            const res0 = await fetch(apiUrl, {
                method: "POST",
                headers: spHeaders,
            })        
            const data = await res0.json();
            const formDigestValue = data?.d?.GetContextWebInformation?.FormDigestValue;
            setFormDigestValue(formDigestValue);
        } catch (e) {
            console.log("Error fetching form digest value:", e);
        } finally {
            setIsAuthenticated(false);
            setIsLoading(false);
        }
    }
    useEffect(() => {
        if (formDigestValue || !isAuthenticated) return;
        handleGetFormDigestValue();
    }, [formDigestValue]);

    const handleUploadFileToSp = async ({file, fileName}: any) => {
        if (currentPath === "Root") return;
        const currentSpPath = currentPath.replace("Root/", "");
        const currentFolderStripped = currentSpPath.replaceAll(" ", "");
        const apiUrl = `${spSiteUrl}/_api/web/GetFolderByServerRelativeUrl('${currentFolderStripped}')/Files/add(url='${fileName}')`;
        const res = await fetch(apiUrl, {
            method: "POST",
            headers: {
                ...spHeaders,
                "X-RequestDigest": formDigestValue,
            },
            body: file,
        });
        const data2 = await res.json();
        console.log('File uploaded:', data2);
    }

    const handleDownloadSpFile = async ({fileName}: any) => {
        const currentSpPath = currentPath.replace("Root/", "");
        const currentFolderStripped = currentSpPath.replaceAll(" ", "");
        let apiUrl = `${spSiteUrl}/_api/web/GetFileByServerRelativeUrl('/sites/DigitalInitiativePublicRelations/${currentFolderStripped}/${fileName}')/$value`;
        const res = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${spAccessToken}`,
            },
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

    const handleCreateSpFolder = async ({folderName}: any) => {
        const currentSpPath = currentPath.replace("Root/", "");
        const apiUrl = `${spSiteUrl}/_api/web/GetFolderByServerRelativeUrl('${currentSpPath}')/folders/add('${folderName}')`;

        const res = await fetch(apiUrl, {
            method: "POST",
            headers: {
                ...spHeaders,
                "X-RequestDigest": formDigestValue,
                "Content-Type": "application/json;odata=verbose",
            },
        });

        const data = await res.json();
        console.log('Folder created:', data);
    }

    return {
        handleUploadFileToSp,
        handleDownloadSpFile,
        handleCreateSpFolder,
        handleFetchSharepoint,
    }
}
export default useSharepointProvider;
