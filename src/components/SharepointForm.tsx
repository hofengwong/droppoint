import { useAtom, useSetAtom } from "jotai";
import {azureTokenAtom, isAuthenticatedAtom, spSiteIdAtom, spSiteUrlAtom} from "@/store/fileManagerAtoms";
import AuthenticationScreen from "./AuthenticationScreen";

const SharepointForm = ({ handleFetchContents }: any) => {
    const [azureToken, setAzureToken] = useAtom(azureTokenAtom);
    const [spSiteUrl, setSpSiteUrl]: any = useAtom(spSiteUrlAtom);
    const setSpSiteId = useSetAtom(spSiteIdAtom);
    const setIsAuthenticated = useSetAtom(isAuthenticatedAtom);
    const onClick = async (e: any) => {
        e.preventDefault();
        setIsAuthenticated(true);
        await handleFetchContents();
    }

    return <>
        <div className="bg-zinc-100 p-8 flex flex-col gap-4 w-full">
            <h1 className="text-sm uppercase tracking-widest font-bold">Sharepoint settings</h1>

            <AuthenticationScreen />

            <form
                className="grid gap-2 w-full"
            >
                <input type="text" className="p-2 border-2 border-zinc-200" placeholder="Access Token"
                    onChange={(e: any) => setAzureToken(e.target.value)}
                />
                <input type="text" className="p-2 border-2 border-zinc-200" placeholder="Sharepoint site URL"
                       defaultValue="https://whitevision.sharepoint.com"
                    onChange={(e: any) => setSpSiteUrl(e.target.value)}
                />
                <button
                    type="button"
                    className="p-2 px-4 bg-black text-white font-bold"
                    onClick={onClick}
                >
                    Retrieve Sharepoint folder
                </button>
            </form>
        </div>
    </>
}
export default SharepointForm;
