import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import JDMatcher from "../components/JDMatcher";

export default function JDMatchPage() {
  const navigate = useNavigate();

  return (
    <Layout>
      <JDMatcher onBack={() => navigate("/analyse")} />
    </Layout>
  );
}
