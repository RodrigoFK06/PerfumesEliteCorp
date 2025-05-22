"use client" // Required for useState

import { HttpTypes } from "@medusajs/types"
import Image from "next/image"
import { useState, useEffect } from "react"
import { clx } from "@medusajs/ui" // For conditional classes

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
}

const ImageGallery = ({ images }: ImageGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState<
    HttpTypes.StoreProductImage | null
  >(images && images.length > 0 ? images[0] : null)

  useEffect(() => {
    if (images && images.length > 0 && !selectedImage) {
      setSelectedImage(images[0])
    }
  }, [images, selectedImage])

  if (!images || images.length === 0) {
    return (
      <div className="relative aspect-[1/1] w-full bg-gray-100 flex items-center justify-center rounded-md">
        <span className="text-gray-500">No images</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-y-4">
      {/* Main Image Display */}
      <div className="relative aspect-[1/1] w-full overflow-hidden bg-ui-bg-subtle rounded-lg">
        {selectedImage && selectedImage.url ? (
          <Image
            src={selectedImage.url}
            alt={`Product image ${images.indexOf(selectedImage) + 1}`}
            fill
            sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
            style={{ objectFit: "contain" }}
            priority={selectedImage === images[0]} // Prioritize if it's the first image
            className="rounded-lg"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
            <span className="text-gray-500">Image not available</span>
          </div>
        )}
      </div>

      {/* Thumbnail Navigation */}
      {images.length > 1 && ( // Only show thumbnails if there's more than one image
        <div className="flex flex-row gap-x-2 overflow-x-auto py-2 no-scrollbar">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setSelectedImage(image)}
              className={clx(
                "relative flex-shrink-0 w-20 h-20 rounded-md overflow-hidden cursor-pointer border-2 transition-all duration-200 ease-in-out",
                {
                  "border-blue-500 ring-2 ring-blue-500 ring-offset-1":
                    selectedImage?.id === image.id,
                  "border-transparent hover:border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500":
                    selectedImage?.id !== image.id,
                }
              )}
              aria-label={`View image ${index + 1}`}
              data-testid={`thumbnail-${index + 1}`}
            >
              {image.url ? (
                <Image
                  src={image.url}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  style={{ objectFit: "contain" }}
                  className="rounded-md"
                  priority={index < 3} // Prioritize first 3 thumbnails
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-50">
                  <span className="text-xs text-gray-400">No img</span>
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default ImageGallery
