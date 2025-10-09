import {atom} from "jotai";
import {v4 as uuidv4} from 'uuid';
import {atomWithStorage} from "jotai/utils";

export const spSiteIdAtom = atom(null);
export const dbAccessTokenAtom = atom(null);
export const spSiteUrlAtom = atom(process.env.NEXT_PUBLIC_SHAREPOINT_SITE_URL);
export const azureTokenAtom = atom(process.env.NEXT_PUBLIC_SHAREPOINT_ACCESS_TOKEN);
export const currentProviderAtom = atomWithStorage('currentCloudStorageProvider', "");
export const isAuthenticatedAtom = atom(false);
export const isLoadingAtom = atom(false);
export const showNewFolderModalAtom = atom(false);
export const foldersAtom: any = atom([]);
export const filesAtom = atom([]);
export const currentPathAtom = atom("Root");
export const currentFolderAtom = atom("Root");

export const toggleNewFolderModalAtom = atom(null,
    (get, set) => {
        set(showNewFolderModalAtom, !get(showNewFolderModalAtom));
    }
);

export const handleClickAtom = atom(null,
    (get, set, paths: any, i: number) => {
        set(currentPathAtom, [...paths].slice(0, i + 1).join("/"));
    }
);

export const handleCreateFolderAtom = atom(null,
    (get, set, data: string) => {
        if (data.trim() === "" || data === "") return;
        const folders: any = get(foldersAtom);
        set(foldersAtom, [
            ...folders,
            {name: data.trim(), id: uuidv4(), path: get(currentPathAtom)}
        ]);
    }
);

export const folderClickAtom = atom(null,
    (get, set, folderName: string) => {
        // set new currentPath
        const currentPath = get(currentPathAtom);
        set(currentPathAtom,
            `${currentPath + "/"}${folderName}`
        );
        set(currentFolderAtom, folderName);
    }
);

export const pathsAtom = atom(
    (get) => {
        const currentPath = get(currentPathAtom);
        const paths = currentPath.split("/");
        return paths;
    }
);

export const indexAtom = atom(
    (get) => {
        const paths = get(pathsAtom);
        return paths.length - 1;
    }
);
