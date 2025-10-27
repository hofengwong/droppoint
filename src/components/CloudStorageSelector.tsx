import {currentProviderAtom, isAuthenticatedAtom} from "@/store/fileManagerAtoms";
import {useAtom, useSetAtom} from "jotai";

export default function CloudStorageSelector() {
    const [currentProvider, setCurrentProvider] = useAtom(currentProviderAtom);
    const setIsAuthenticated = useSetAtom(isAuthenticatedAtom);
    return <>
        <div className="bg-zinc-100 p-8 flex flex-col gap-4 w-full mb-8">
            <h1 className="text-sm uppercase tracking-widest font-bold">Cloud storage provider</h1>

            <div className="flex flex-row gap-4">
                <button className={`cursor-pointer font-extrabold uppercase tracking-widest bg-gray-200 p-4 text-sm ${currentProvider === "sharepoint" ? "border-4 border-black" : ""}`}
                     onClick={() => {
                         setCurrentProvider("sharepoint");
                         setIsAuthenticated(true);
                     }}
                >
                    SharePoint
                </button>
                <button className={`bg-gray-200 p-4 cursor-pointer font-extrabold uppercase tracking-widest text-sm ${currentProvider === "dropbox" ? "border-4 border-black" : ""}`}
                     onClick={() => setCurrentProvider("dropbox")}
                >
                    Dropbox
                </button>
            </div>
        </div>
    </>
}
