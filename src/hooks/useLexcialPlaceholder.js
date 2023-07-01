import { useParams } from "react-router-dom";

function DateTime() {
  const today = new Date();
  const date = new Intl.DateTimeFormat("en-us", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return <>{date.format(today)}</>;
}

export default function Placeholder() {
  const params = useParams();
  const name = params.workspace_name;
  return (
    <div className='editor-placeholder'>
      <DateTime />, Notes for {name}
    </div>
  );
}
