// src/client/content/components/textfields/combined-features.js
import { createComponentSection } from "../../../layout";

import { searchIcon, clearIcon } from "../../../icons";

import { createLayout, createTextfield } from "mtrl";

export const initCombinedFeatures = (container) => {
  const title = "Textfields with Combined Features";
  const layout = createLayout(
    createComponentSection({ title }),
    container
  ).component;

  // Filled textfield with both icons and supporting text
  const filled = createTextfield({
    label: "Search",
    placeholder: "Search...",
    variant: "filled",
    leadingIcon: searchIcon,
    trailingIcon: clearIcon,
    supportingText: "Type to search, click X to clear",
  });

  // Add click event to the trailing icon
  filled.trailingIcon.addEventListener("click", () => {
    filled.setValue("");
  });

  // Outlined textfield with both icons and error state
  const outlined = createTextfield({
    label: "Search",
    placeholder: "Search...",
    variant: "outlined",
    leadingIcon: searchIcon,
    trailingIcon: clearIcon,
    supportingText: "min 3 characters",
    error: true,
  });

  // Add click event to the trailing icon
  outlined.trailingIcon.addEventListener("click", () => {
    outlined.setValue("");
  });

  // Add combined feature textfields to the layout
  layout.showcase.appendChild(filled.element);
  layout.showcase.appendChild(outlined.element);
};
