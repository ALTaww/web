import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import UserChecks from "../../templates/UserChecks";
import { showPopup } from "../../utils/helpers";

// Мокаем showPopup
jest.mock("../../utils/helpers", () => ({
  ...jest.requireActual("../../utils/helpers"),
  showPopup: jest.fn(),
}));

describe("UserChecks", () => {
  it("рендерит элемент забаненного пользователя", () => {
    render(
      <UserChecks
        is_banned={true}
        is_verified_by_admin={false}
        is_verified_by_vk={false}
      />
    );
    expect(screen.getByTestId("is_banned")).toBeInTheDocument();
  });

  it("не рендерит элемент забаненного пользователя, если is_banned=false", () => {
    render(
      <UserChecks
        is_banned={false}
        is_verified_by_admin={false}
        is_verified_by_vk={false}
      />
    );
    expect(screen.queryByTestId("is_banned")).not.toBeInTheDocument();
  });

  it("рендерит значок верификации администратора", () => {
    render(
      <UserChecks
        is_banned={false}
        is_verified_by_admin={true}
        is_verified_by_vk={false}
      />
    );
    expect(screen.getByTestId("verified_admin")).toBeInTheDocument();
  });

  it("не рендерит значок верификации администратора, если is_verified_by_admin=false", () => {
    render(
      <UserChecks
        is_banned={false}
        is_verified_by_admin={false}
        is_verified_by_vk={false}
      />
    );
    expect(screen.queryByTestId("verified_admin")).not.toBeInTheDocument();
  });

  it("рендерит значок верификации ВКонтакте", () => {
    render(
      <UserChecks
        is_banned={false}
        is_verified_by_admin={false}
        is_verified_by_vk={true}
      />
    );
    expect(screen.getByTestId("verified_vk")).toBeInTheDocument();
  });

  it("не рендерит значок верификации ВКонтакте, если is_verified_by_vk=false", () => {
    render(
      <UserChecks
        is_banned={false}
        is_verified_by_admin={false}
        is_verified_by_vk={false}
      />
    );
    expect(screen.queryByTestId("verified_vk")).not.toBeInTheDocument();
  });

  it("вызывает showPopup при наведении на verified_admin", () => {
    render(
      <UserChecks
        is_banned={false}
        is_verified_by_admin={true}
        is_verified_by_vk={false}
      />
    );
    const adminIcon = screen.getByTestId("verified_admin");

    fireEvent.mouseEnter(adminIcon);
    expect(showPopup).toHaveBeenCalledWith(
      expect.any(Object),
      expect.any(String)
    );
  });

  it("вызывает showPopup при наведении на verified_vk", () => {
    render(
      <UserChecks
        is_banned={false}
        is_verified_by_admin={false}
        is_verified_by_vk={true}
      />
    );
    const vkIcon = screen.getByTestId("verified_vk");

    fireEvent.mouseEnter(vkIcon);
    expect(showPopup).toHaveBeenCalledWith(
      expect.any(Object),
      expect.any(String)
    );
  });
});
