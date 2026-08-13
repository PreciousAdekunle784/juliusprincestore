"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageOff } from "lucide-react";

export function Gallery({ images, name }: { images: string[]; name: string }) {
  const [i, setI] = useState(0);
  const has = images.length > 0;

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square bg-mist rounded-[6px] overflow-hidden border border-black/[0.06]">
        {has ? (
          <Image
            src={images[i]}
            alt={name}
            fill
            sizes="(max-width:1024px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        ) : (
          <span className="absolute inset-0 grid place-items-center text-slate/40">
            <ImageOff size={44} />
          </span>
        )}
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {images.map((src, idx) => (
            <button
              key={idx}
              onClick={() => setI(idx)}
              aria-label={`View image ${idx + 1}`}
              aria-current={idx === i}
              className={`relative aspect-square rounded-[3px] overflow-hidden border-2 transition-colors ${
                idx === i ? "border-accent" : "border-black/[0.08] hover:border-black/25"
              }`}
            >
              <Image src={src} alt="" fill sizes="20vw" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
