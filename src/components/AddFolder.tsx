import React from "react";

import {FcOpenedFolder} from "react-icons/fc";
import {BsPlusCircleFill} from "react-icons/bs";
import {useSetAtom} from "jotai";
import {toggleNewFolderModalAtom} from "@/store/fileManagerAtoms";

const AddFolder = () => {
    const toggleModal = useSetAtom(toggleNewFolderModalAtom);
    return (
        <>
            <a
                className="flex relative cursor-pointer text-xs w-[100px] justify-center"
                onClick={toggleModal}
            >
                <span className="relative">
                    <FcOpenedFolder
                        className="text-[50px]"
                    />
                    <BsPlusCircleFill
                        className="text-[20px] text-green-700 absolute top-0 right-0"
                    />
                </span>
            </a>
        </>
    );
};
export default AddFolder;
