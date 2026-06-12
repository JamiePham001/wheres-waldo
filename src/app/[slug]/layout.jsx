import "../globals.css";

export const metadata = {
  title: "Where's Waldo Level X",
  description: "Find Waldo in this challenging level",
};

export default function MapCreationLayout({ children }) {
  return <div className="page-layout">{children}</div>;
}
