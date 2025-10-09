import React, {useEffect} from "react";
import {useAtomValue, useSetAtom} from "jotai";
import {handleCreateFolderAtom, toggleNewFolderModalAtom, showNewFolderModalAtom} from "@/store/fileManagerAtoms";
import {RxCross1} from "react-icons/rx";

const NewFolderModal = ({handleCreateFolder, refetch}: any) => {
    const show = useAtomValue(showNewFolderModalAtom);
    const toggleNewFolderModal = useSetAtom(toggleNewFolderModalAtom);
    const addFolderToState = useSetAtom(handleCreateFolderAtom);

    const textInput: any = React.createRef();

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        await handleCreateFolder({
            folderName: textInput.current.value
        })
        await refetch({fetchFiles: false});
        toggleNewFolderModal();
    };

    useEffect(() => {
        if (!show) return;
        textInput.current.focus();
    }, [show]);

    return (
        <>
            {show && (
                <section
                    className="fixed z-50 inset-0 bg-black/50 flex justify-center items-center"
                >
                    <form
                        onSubmit={handleSubmit}
                        className="bg-white p-8 relative"
                    >
                        <RxCross1
                            onClick={toggleNewFolderModal}
                            className="absolute top-0 right-0 p-4 text-[48px] cursor-pointer"
                        />
                        <h2 className="font-bold">Create a new folder</h2>
                        <input
                            className="mt-4 bg-zinc-100 p-2"
                            type="text"
                            placeholder="Folder Name"
                            maxLength={30}
                            ref={textInput}
                            required
                        />
                        <button type="submit" className="mt-4 mb-2 p-2 px-4 bg-black text-white font-bold">
                            Create Folder
                        </button>
                    </form>
                </section>
            )}
        </>
    );
};

export default NewFolderModal;
