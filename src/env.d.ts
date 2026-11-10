/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    /** true only on the preview site, after the Studio's Presentation tab let this browser in */
    draft?: boolean;
  }
}

interface ImportMetaEnv {
  readonly HOD_PREVIEW: boolean;
}
