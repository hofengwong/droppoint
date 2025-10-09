import {currentProviderAtom, isAuthenticatedAtom} from "@/store/fileManagerAtoms";
import {useAtom, useSetAtom} from "jotai";

export default function CloudStorage() {
    const [currentProvider, setCurrentProvider] = useAtom(currentProviderAtom);
    const setIsAuthenticated = useSetAtom(isAuthenticatedAtom);
    return <>
        <div className="bg-zinc-100 p-8 flex flex-col gap-4 w-full mb-8">
            <h1 className="text-sm uppercase tracking-widest font-bold">Cloud storage provider</h1>

            <div className="flex flex-row gap-4">
                <img src="/images/sharepoint-logo.png" className="w-28 object-contain cursor-pointer"
                     onClick={() => {
                         setCurrentProvider("sharepoint");
                         setIsAuthenticated(true);
                     }}
                />
                <img src="/images/dropbox-logo.png" className="w-24 object-contain cursor-pointer"
                     onClick={() => setCurrentProvider("dropbox")}
                />
            </div>
        </div>
    </>
}
