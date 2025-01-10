import React from "react";

const AdminInfoPanel = (props) => {
  if (!props || !props.id) {
    return <div>Информация не найдена</div>;
  }
  return (
    <div className="admin-panel">
      {Object.keys(props).map((key, idx) => (
        <p key={idx} className="line">
          {key}: {props[key]}
        </p>
      ))}
    </div>
  );
};

export default AdminInfoPanel;
