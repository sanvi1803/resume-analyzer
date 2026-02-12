import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import ResumeQualityAnalyzer from "../components/ResumeQualityAnalyzer";

export default function QualityAnalysisPage() {
  const navigate = useNavigate();

  return (
    <Layout>
      <ResumeQualityAnalyzer onBack={() => navigate("/analyse")} />
    </Layout>
  );
}
