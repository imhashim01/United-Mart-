import { useEffect } from "react";

const SITE_NAME = "United Mart Sukkur";

export default function usePageTitle(title, description) {
  useEffect(() => {
    document.title = title ? `${title} | ${SITE_NAME}` : SITE_NAME;

    if (description) {
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", "description");
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", description);
    }
  }, [title, description]);
}