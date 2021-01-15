import { ImageLinkAndCaption } from "../interfaces";
import { SG_TIMEZONE_OFFSET } from "../config/config";

export function getSgDate() {
  const SG_OFFSET_MS = SG_TIMEZONE_OFFSET * 60 * 1000;

  const localDate = new Date();
  const localOffsetMs = localDate.getTimezoneOffset() * 60 * 1000;
  const sgDate = new Date(localDate.getTime() + SG_OFFSET_MS + localOffsetMs);

  const yyyy = sgDate.getFullYear();
  const mm = (sgDate.getMonth() + 1).toString().padStart(2, "0");
  const dd = sgDate.getDate().toString().padStart(2, "0");

  return yyyy + mm + dd;
}

export function cleanWebsiteText(text: string) {
  return text.replace(/[\u00AD\r\t\n]/g, "");
}

export function pairImagesAndCaptions(
  imageLinks: string[],
  captions: string[]
): ImageLinkAndCaption[] {
  if (imageLinks.length === 0) {
    return captions.map((caption) => ({
      imageLink: null,
      caption,
    }));
  } else if (captions.length === 0) {
    return imageLinks.map((imageLink) => ({ imageLink, caption: null }));
  }

  return [
    { imageLink: imageLinks[0], caption: captions[0] },
    ...pairImagesAndCaptions(imageLinks.slice(1), captions.slice(1)),
  ];
}

export function delay(ms: number) {
  return new Promise((resolve, _) => setTimeout(resolve, ms));
}
