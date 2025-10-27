import useDropboxProvider from "@/hooks/useDropboxProvider";
import {useAtom} from "jotai/index";
import {isAuthenticatedAtom} from "@/store/fileManagerAtoms";

const DropboxForm = () => {
    const {
        handleDbFormSubmit,
        dropboxFolderLinkInputRef,
        dropboxFolderPasswordInputRef,
        appKey
    } = useDropboxProvider();
    const [isAuthenticated, setIsAuthenticated] = useAtom(isAuthenticatedAtom);
    const authenticationUrl = `https://www.dropbox.com/oauth2/authorize?client_id=${appKey}&response_type=code&token_access_type=offline&force_reauthentication=true&redirect_uri=${window.location.origin}`;

    return <>
        <div className="bg-zinc-100 p-8 flex flex-col gap-4 w-full">
            <h1 className="text-sm uppercase tracking-widest font-bold">Dropbox settings</h1>

            <form
                onSubmit={handleDbFormSubmit}
                className="grid gap-2 w-full"
            >
                {/*<div className="grid grid-cols-1 gap-2">*/}
                {/*    <input ref={dropboxFolderLinkInputRef} type="text" className="bg-white p-2"*/}
                {/*           placeholder="Dropbox folder link"/>*/}
                {/*    <input ref={dropboxFolderPasswordInputRef} type="password"*/}
                {/*           className="bg-white p-2 hidden"*/}
                {/*           placeholder="Folder password"/>*/}
                {/*</div>*/}

                {/*<button type="submit" className="p-2 px-4 bg-black text-white font-bold">*/}
                {/*    Set folder*/}
                {/*</button>*/}

                <button
                    type="button"
                    className="p-2 px-4 bg-black text-white font-bold"
                    onClick={() => location.href = authenticationUrl}
                >
                    {isAuthenticated
                        ? "Re-authenticate"
                        : "Authenticate via User Authentication"
                    }
                </button>
            </form>
        </div>
    </>
}

export default DropboxForm;
