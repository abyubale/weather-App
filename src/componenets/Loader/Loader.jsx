import { Spinner } from "react-bootstrap";

const Loader = () => {
  return (
    <>
      <Spinner
        animation="grow"
        style={{ width: "180px", height: "180px", backgroundColor: "green" }}
      />
    </>
  );
};

export default Loader;
