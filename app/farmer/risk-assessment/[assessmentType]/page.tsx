import { RiskAssessmentQuestionnaire } from "@/components/risk-assessment/risk-assessment-questionnaire"

const demoFarmerId = "demo-farmer-id"

interface AssessmentQuestionnairePageProps {
    params: {
        assessmentType: string
    }
}

export default function AssessmentQuestionnairePage({ params }: AssessmentQuestionnairePageProps) {
    return <RiskAssessmentQuestionnaire assessmentType={params.assessmentType} farmerId={demoFarmerId} />
}
