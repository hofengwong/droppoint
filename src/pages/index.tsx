import Head from "next/head";
import Breadcrumbs from "@/components/Breadcrumbs";
import MainFolder from "@/components/MainFolder";
import NewFolderModal from "@/components/NewFolderModal";
import {useEffect} from "react";
import {useAtom} from "jotai";
import {
    filesAtom,
    currentPathAtom,
    foldersAtom,
    isAuthenticatedAtom, currentProviderAtom
} from "@/store/fileManagerAtoms";
import useSharepointProvider from "@/hooks/useSharepointProvider";
import useDropboxProvider from "@/hooks/useDropboxProvider";
import DropboxForm from "@/components/DropboxForm";
import SharepointForm from "@/components/SharepointForm";
import Debug from "@/components/Debug";
import AuthenticationScreen from "@/components/AuthenticationScreen";
import CloudStorageSelector from "@/components/CloudStorageSelector";

export default function Home() {
    const [isAuthenticated, setIsAuthenticated] = useAtom(isAuthenticatedAtom);
    const [currentPath, setCurrentPath] = useAtom(currentPathAtom);
    const [folders, setFolders] = useAtom(foldersAtom);
    const [files, setFiles] = useAtom(filesAtom);
    const [currentProvider, setCurrentProvider] = useAtom(currentProviderAtom);
    const {
        handleUploadFileToSp,
        handleDownloadSpFile,
        handleFetchSharepoint,
        handleCreateSpFolder
    }: any = useSharepointProvider();
    const {
        handleDownloadDbFile,
        handleCreateDbFolder,
        handleFetchDropbox,
        handleUploadFileToDb
    } = useDropboxProvider();

    let handleCreateFolder: any;
    let handleUploadFile: any;
    let handleDownloadFile: any;
    let handleFetchContents: any = () => {};
    let settingsForm: any;

    switch (currentProvider) {
        case "dropbox":
            handleCreateFolder = handleCreateDbFolder;
            handleUploadFile = handleUploadFileToDb;
            handleDownloadFile = handleDownloadDbFile;
            handleFetchContents = handleFetchDropbox;
            settingsForm = <DropboxForm/>;
            break;
        case "sharepoint":
            handleCreateFolder = handleCreateSpFolder;
            handleUploadFile = handleUploadFileToSp;
            handleDownloadFile = handleDownloadSpFile;
            handleFetchContents = handleFetchSharepoint;
            settingsForm = <SharepointForm handleFetchContents={handleFetchContents}/>;
            break;
    }

    // update contents of current path when currentPath changes
    useEffect(() => {
        if (!isAuthenticated) return;
        setFolders([]);
        setFiles([]);
        handleFetchContents();
    }, [currentPath, isAuthenticated]);

    return (<>
            <Head>
                <title>Hubl by WhiteVision connector for Dropbox</title>
            </Head>

            <main className="flex flex-col items-center mx-auto justify-between p-24 w-[800px]">

                <CloudStorageSelector />

                {settingsForm}

                <section className="mt-8 p-8 border-2 border-zinc-200 w-full">
                    <Breadcrumbs/>
                    <MainFolder
                        handleUploadFile={handleUploadFile}
                        handleDownloadFile={handleDownloadFile}
                        refetch={handleFetchContents}
                    />
                    <NewFolderModal
                        handleCreateFolder={handleCreateFolder}
                        refetch={handleFetchContents}
                    />
                </section>

                <Debug/>
            </main>
        </>
    )
}
