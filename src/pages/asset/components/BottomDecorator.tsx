import React from "react";
import style from "../AssetDetails.module.css";

/**
 * Bottom decorative element component
 * Displays industrial-style footer with quality message
 */
export const BottomDecorator: React.FC = () => {
  return (
    <div className={style.bottomDecorator}>
      <div className={style.decoratorLine}></div>
      <p className={style.decoratorText}>
        QUALIDADE <span className={style.decoratorBullet}>●</span> PERFORMANCE{" "}
        <span className={style.decoratorBullet}>●</span> CONFIANÇA
      </p>
    </div>
  );
};
