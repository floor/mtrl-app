// src/client/content/components/textfields/supporting-text.js
import { createComponentSection } from "../../../layout";

import { createLayout, createTextfield } from "mtrl";

import { showIcon, hideIcon } from "../../../icons";

export const createPasswordsShowcase = (container) => {
  const title = "Textfields with Supporting Text";
  const layout = createLayout(
    createComponentSection({ title }),
    container
  ).component;

  // Outlined textfield with supporting text
  const password = createTextfield({
    label: "Password",
    type: "password",
    variant: "outlined",
    supportingText: "At least 8 characters",
    parent: layout.showcase,
  });

  // Outlined textfield with supporting text
  const passowrdWithVisibilityIcon = createTextfield({
    label: "Password",
    type: "password",
    variant: "outlined",
    trailingIcon: showIcon,
    supportingText: "At least 8 characters",
    parent: layout.showcase,
  });

  passowrdWithVisibilityIcon.trailingIcon.addEventListener("click", () => {
    passowrdWithVisibilityIcon.input.type =
      passowrdWithVisibilityIcon.input.type === "password"
        ? "text"
        : "password";
    passowrdWithVisibilityIcon.setTrailingIcon(
      passowrdWithVisibilityIcon.input.type === "password" ? showIcon : hideIcon
    );
  });

  // Textfield with error state and supporting text
  const error = createTextfield({
    label: "Password",
    type: "password",
    variant: "outlined",
    supportingText: "At least 8 characters",
    error: true,
    parent: layout.showcase,
  });
};
