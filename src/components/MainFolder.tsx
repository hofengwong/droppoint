import React, {createRef, useState} from "react";
import Folder from "./Folder";
import {useAtomValue} from "jotai";
import {filesAtom, currentPathAtom, foldersAtom, isLoadingAtom} from "@/store/fileManagerAtoms";
import AddFolder from "@/components/AddFolder";
import File from "@/components/File";
import LoadingSpinner from "@/components/LoadingSpinner";

const MainFolder = ({children, handleUploadFile, handleDownloadFile, refetch}: any) => {
    const folders: any = useAtomValue(foldersAtom);
    const files: any = useAtomValue(filesAtom);
    const currentPath = useAtomValue(currentPathAtom);
    const isLoading = useAtomValue(isLoadingAtom);
    const [selectedFile, setSelectedFile]: any = useState(null);
    const [selectedFileName, setSelectedFileName]: any = useState(null);

    const onFormSubmit = async (e: any) => {
        e.preventDefault();
        await handleUploadFile({
            file: selectedFile,
            fileName: selectedFileName,
        });
        await refetch({fetchFolders: false});
    }

    const handleFileInputChange = (e: any) => {
        setSelectedFile(e?.target?.files[0]);
        setSelectedFileName(e?.target?.files[0]?.name);
    }

    return (
        <>
            <form className="bg-zinc-100 w-full p-4" onSubmit={onFormSubmit}>
                <h6 className="font-extrabold uppercase tracking-widest text-xs mb-2">
                    Upload file
                </h6>

                <div className="flex flex-row items-center justify-between gap-2">
                    <input
                        type="file"
                        id="file"
                        onChange={handleFileInputChange}
                    />
                    <button
                        type="submit"
                        className="bg-black py-2 px-4 text-white text-xs font-extrabold uppercase"
                    >
                        {
                            isLoading
                                ? <LoadingSpinner className="invert w-4 h-4"/>
                                : "Upload"
                        }
                    </button>
                </div>
            </form>

            <section className="mt-8 flex flex-row flex-wrap gap-x-4 gap-y-8">
                {!isLoading && <AddFolder/>}
                {folders
                    //?.filter((folder: any) => folder.path === currentPath)
                    ?.map((folder: any) => (
                        <Folder
                            name={folder.name}
                            key={folder.id}
                        />
                    ))
                }
                {files?.map((file: any) => (
                    <File
                        key={file.id}
                        id={file.id}
                        name={file.name}
                        handleDownloadFile={handleDownloadFile}
                    />
                ))
                }
                {children}
                {isLoading && (<LoadingSpinner className="mx-auto"/>)}
            </section>
        </>
    );
};

export default MainFolder;
