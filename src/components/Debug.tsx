import { useAtom, useAtomValue } from "jotai";
import {
    azureTokenAtom,
    currentFolderAtom,
    currentPathAtom, dbAccessTokenAtom,
    filesAtom,
    foldersAtom,
    isAuthenticatedAtom
} from "@/store/fileManagerAtoms";

export default function Debug() {
    const [currentFolder, setCurrentFolder] = useAtom(currentFolderAtom);
    const [isAuthenticated, setIsAuthenticated] = useAtom(isAuthenticatedAtom);
    const [currentPath, setCurrentPath] = useAtom(currentPathAtom);
    const [folders, setFolders] = useAtom(foldersAtom);
    const [files, setFiles] = useAtom(filesAtom);
    const dbAccessToken = useAtomValue(dbAccessTokenAtom);
    const azureToken = useAtomValue(azureTokenAtom);

    return <>
        <pre className="text-xs mt-16 break-words break-all max-w-[640px] overflow-x-scroll">
            Current path: {currentPath}
            <br />
            currentFolder: {currentFolder}
            <br />
            Folders: {JSON.stringify(folders, null, 2)}
            <br />
            files: {JSON.stringify(files, null, 2)}
            <br />
            isAuthenticated: {JSON.stringify(isAuthenticated)}
            <br />
            dbAccessToken: {dbAccessToken}
            <br />
            azureToken: {azureToken}
        </pre>
    </>
}
