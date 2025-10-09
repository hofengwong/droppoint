import React from "react";
import {v4 as uuidv4} from 'uuid';
import {useAtomValue, useSetAtom} from "jotai";
import {handleClickAtom, indexAtom, pathsAtom} from "@/store/fileManagerAtoms";

const Breadcrumbs = () => {
    const index = useAtomValue(indexAtom);
    const paths = useAtomValue(pathsAtom);
    const handleClick: any = useSetAtom(handleClickAtom);
    return (
        <>
            <section className="flex flex-row gap-4 mb-8">
                { paths.map((path, i) => (<>
                        <div
                            key={`${uuidv4()}-${i}`}
                            className={`${index === i ? 'active' : null} cursor-pointer`}
                            onClick={() => handleClick(paths, i)}
                        >
                            {path.length > 10 ? path.slice(0, 10) + "..." : path}
                        </div>
                        /
                    </>))
                }
            </section>
        </>
    );
};

export default Breadcrumbs;
