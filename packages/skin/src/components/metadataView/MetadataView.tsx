// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import classNames from "classnames";
import { h } from "preact";
import { useMemo } from "preact/hooks";

import { IAssetMetadata } from "../../utils/metadata";
import style from "./metadataView.module.scss";

export default function MetadataView({
  asset,
  visible,
}: {
  asset?: IAssetMetadata;
  visible?: boolean;
}) {
  const image = useMemo(() => {
    if (!asset || !asset.image) {
      return null;
    }
    const url = new URL(asset.image);
    // rendered resolution of the image at full width ( 60em )
    url.searchParams.set("w", "307");
    url.searchParams.set("h", "171");
    return url.toString();
  }, [asset]);

  if (!asset || !asset.title) return null;
  return (
    <div
      class={classNames(style.metadata, {
        [style.hidden]: !visible,
      })}
    >
      <div class={style.container}>
        {image && (
          <div class={style.imageWrapper}>
            <div class={style.aspectWrapper}>
              <img class={style.image} src={image} />
            </div>
          </div>
        )}
        <div class={style.contentHolder}>
          <h4>{asset.title}</h4>
          <span>{asset.duration}</span>
          <div class={style.textWrapper}>
            <p>{asset.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
