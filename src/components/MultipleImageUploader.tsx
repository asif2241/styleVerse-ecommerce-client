// "use client"
// import { AlertCircleIcon, ImageIcon, UploadIcon, XIcon } from "lucide-react";

// import { FileMetadata, useFileUpload } from "@/hooks/use-file-upload";
// import { Button } from "@/components/ui/button";
// import { Dispatch, useEffect } from "react";
// import Image from "next/image";

// export default function MultipleImageUploader({
//     defaultImages = [],
//     onChange,
// }: {
//     defaultImages?: (File | FileMetadata)[];
//     onChange: Dispatch<React.SetStateAction<[] | (File | FileMetadata)[]>>;
// }) {
//     const maxSizeMB = 5;
//     const maxSize = maxSizeMB * 1024 * 1024; // 5MB default
//     const maxFiles = 3;

//     const [
//         { files, isDragging, errors },
//         {
//             handleDragEnter,
//             handleDragLeave,
//             handleDragOver,
//             handleDrop,
//             openFileDialog,
//             removeFile,
//             getInputProps,
//         },
//     ] = useFileUpload({
//         accept: "image/svg+xml,image/png,image/jpeg,image/jpg,image/gif",
//         maxSize,
//         multiple: true,
//         maxFiles,
//     });

//     // useEffect(() => {
//     //     if (files.length > 0) {
//     //         const imageList = files.map((item) => item.file);
//     //         onChange(imageList);
//     //     } else {
//     //         onChange([]);
//     //     }
//     // }, [files]);
//     useEffect(() => {
//         if (files.length > 0) {
//           const imageList = [
//             ...defaultImages,          // keep existing images
//             ...files.map(item => item.file), // add new uploads
//           ];
//           onChange(imageList);
//         } else {
//           onChange(defaultImages); // preserve initial images instead of clearing
//         }
//       }, [files, defaultImages]);

//     return (
//         <div className="flex flex-col gap-2">
//             {/* Drop area */}
//             <div
//                 onDragEnter={handleDragEnter}
//                 onDragLeave={handleDragLeave}
//                 onDragOver={handleDragOver}
//                 onDrop={handleDrop}
//                 data-dragging={isDragging || undefined}
//                 data-files={files.length > 0 || undefined}
//                 className="border-input data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 relative flex min-h-52 flex-col items-center overflow-hidden rounded-xl border border-dashed p-4 transition-colors not-data-[files]:justify-center has-[input:focus]:ring-[3px]"
//             >
//                 <input
//                     {...getInputProps()}
//                     className="sr-only"
//                     aria-label="Upload image file"
//                 />
//                 {files.length > 0 ? (
//                     <div className="flex w-full flex-col gap-3">
//                         <div className="flex items-center justify-between gap-2">
//                             <h3 className="truncate text-sm font-medium">
//                                 Uploaded Files ({files.length})
//                             </h3>
//                             <Button
//                                 variant="outline"
//                                 size="sm"
//                                 onClick={openFileDialog}
//                                 disabled={files.length >= maxFiles}
//                                 type="button"
//                             >
//                                 <UploadIcon
//                                     className="-ms-0.5 size-3.5 opacity-60"
//                                     aria-hidden="true"
//                                 />
//                                 Add more
//                             </Button>
//                         </div>

//                         <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
//                             {files.map((file) => (
//                                 <div
//                                     key={file.id}
//                                     className="bg-accent relative aspect-square rounded-md"
//                                 >
//                                     <Image
//                                         fill
//                                         src={file.preview as string}
//                                         alt={file.file.name}
//                                         className="size-full rounded-[inherit] object-cover"
//                                     />
//                                     <Button
//                                         onClick={() => removeFile(file.id)}
//                                         size="icon"
//                                         className="border-background focus-visible:border-background absolute -top-2 -right-2 size-6 rounded-full border-2 shadow-none"
//                                         aria-label="Remove image"
//                                         type="button"
//                                     >
//                                         <XIcon className="size-3.5" />
//                                     </Button>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 ) : (
//                     <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
//                         <div
//                             className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
//                             aria-hidden="true"
//                         >
//                             <ImageIcon className="size-4 opacity-60" />
//                         </div>
//                         <p className="mb-1.5 text-sm font-medium">Drop your images here</p>
//                         <p className="text-muted-foreground text-xs">
//                             SVG, PNG, JPG or GIF (max. {maxSizeMB}MB)
//                         </p>
//                         <Button
//                             type="button"
//                             variant="outline"
//                             className="mt-4"
//                             onClick={openFileDialog}
//                         >
//                             <UploadIcon className="-ms-1 opacity-60" aria-hidden="true" />
//                             Select images
//                         </Button>
//                     </div>
//                 )}
//             </div>

//             {errors.length > 0 && (
//                 <div
//                     className="text-destructive flex items-center gap-1 text-xs"
//                     role="alert"
//                 >
//                     <AlertCircleIcon className="size-3 shrink-0" />
//                     <span>{errors[0]}</span>
//                 </div>
//             )}
//         </div>
//     );
// }

"use client";

import { AlertCircleIcon, ImageIcon, UploadIcon, XIcon } from "lucide-react";
import { FileMetadata, useFileUpload } from "@/hooks/use-file-upload";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Dispatch, useEffect, useState } from "react";

type ImageValue = File | FileMetadata;

export default function MultipleImageUploader({
    defaultImages = [],
    onChange,
}: {
    defaultImages?: ImageValue[];
    onChange: Dispatch<React.SetStateAction<ImageValue[]>>;
}) {
    const maxSizeMB = 5;
    const maxSize = maxSizeMB * 1024 * 1024;
    const maxFiles = 3;

    // 🟡 Existing DB images (can be removed)
    const [persistedImages, setPersistedImages] = useState<FileMetadata[]>(
        defaultImages.filter((img): img is FileMetadata => !(img instanceof File))
    );

    // 🟢 New uploads handled by hook
    const [
        { files, isDragging, errors },
        {
            handleDragEnter,
            handleDragLeave,
            handleDragOver,
            handleDrop,
            openFileDialog,
            removeFile,
            getInputProps,
        },
    ] = useFileUpload({
        accept: "image/png,image/jpeg,image/jpg,image/webp",
        maxSize,
        multiple: true,
        maxFiles,
    });

    // 🔁 Sync merged array to parent
    useEffect(() => {
        const merged: ImageValue[] = [
            ...persistedImages,
            ...files.map(f => f.file),
        ];
        onChange(merged);
    }, [persistedImages, files, onChange]);

    // ❌ Remove an existing DB image
    const removePersisted = (id: string) => {
        setPersistedImages(imgs => imgs.filter(img => img.id !== id && img.url !== id));
    };

    return (
        <div className="flex flex-col gap-3">

            {/* Existing Images from DB */}
            {persistedImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {persistedImages.map(img => (
                        <div key={img.id ?? img.url} className="relative aspect-square rounded-md bg-accent">
                            <Image
                                fill
                                src={img.url}
                                alt={img.name ?? "Existing image"}
                                className="object-cover rounded-md"
                            />
                            <Button
                                type="button"
                                size="icon"
                                onClick={() => removePersisted(img.id ?? img.url)}
                                className="absolute -top-2 -right-2 size-6 rounded-full"
                            >
                                <XIcon className="size-3.5" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}

            {/* Upload Dropzone */}
            <div
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                data-dragging={isDragging || undefined}
                className="border-dashed border rounded-xl p-4 min-h-44 flex flex-col items-center justify-center"
            >
                <input {...getInputProps()} className="sr-only" />

                {files.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
                        {files.map(file => (
                            <div key={file.id} className="relative aspect-square rounded-md bg-accent">
                                <Image
                                    fill
                                    src={file.preview as string}
                                    alt={file.file.name}
                                    className="object-cover rounded-md"
                                />
                                <Button
                                    type="button"
                                    size="icon"
                                    onClick={() => removeFile(file.id)}
                                    className="absolute -top-2 -right-2 size-6 rounded-full"
                                >
                                    <XIcon className="size-3.5" />
                                </Button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center">
                        <div className="size-11 mb-2 rounded-full border flex items-center justify-center">
                            <ImageIcon className="size-4 opacity-60" />
                        </div>
                        <p className="text-sm font-medium">Drop images or upload</p>
                        <p className="text-xs text-muted-foreground">
                            JPG, PNG, WEBP — max {maxSizeMB}MB
                        </p>
                        <Button variant="outline" className="mt-3" type="button" onClick={openFileDialog}>
                            <UploadIcon className="-ms-1 size-3.5 opacity-60" /> Select images
                        </Button>
                    </div>
                )}
            </div>

            {errors.length > 0 && (
                <div className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircleIcon className="size-3" /> {errors[0]}
                </div>
            )}
        </div>
    );
}
