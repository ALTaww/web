import React, { FC } from "react";
import { expressions } from "../utils/consts";
import verified_admin_image from "../assets/img/verified_admin.png";
import verified_vk_image from "../assets/img/verified_vk.png";
import { showPopup } from "../utils/helpers";

interface IComponent {
  is_banned: boolean;
  is_verified_by_admin: boolean;
  is_verified_by_vk: boolean;
}

const UserChecks: FC<IComponent> = ({
  is_banned,
  is_verified_by_admin,
  is_verified_by_vk,
}) => {
  return (
    <>
      {is_banned && <span className="is_banned"> забанен</span>}
      {is_verified_by_admin && (
        <img
          className="verified_admin"
          src={verified_admin_image}
          aria-label={expressions.is_verified_by_admin}
          onMouseEnter={(e) => showPopup(e, expressions.is_verified_by_admin)}
        />
      )}
      {is_verified_by_vk && (
        <img
          className="verified_vk"
          src={verified_vk_image}
          aria-label={expressions.is_verified_by_vk}
          onMouseEnter={(e) => showPopup(e, expressions.is_verified_by_vk)}
        />
      )}
    </>
  );
};

export default UserChecks;
