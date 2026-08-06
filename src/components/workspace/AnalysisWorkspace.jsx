import { useEffect } from 'react'
import { useAnalysisStore } from '../../state/analysisStore'
import WorkspaceHeader from './WorkspaceHeader'
import SignalAnalyzer from './SignalAnalyzer'
import ActivityConsole from './ActivityConsole'
import LiveMarketPanel from './LiveMarketPanel'
import RunControl from './RunControl'
import RiskDisclaimerBar from './RiskDisclaimerBar'
import AIAssistant from './AIAssistant'
import AnalysisModal from './AnalysisModal'
import AnalysisToolScanner from '../../pages/tabs/AnalysisToolScanner'
import DigitCirclesView from '../../pages/tabs/DigitCirclesView'

export default function AnalysisWorkspace() {
  const mode = useAnalysisStore(s => s.mode)
  const init = useAnalysisStore(s => s.init)
  const dispose = useAnalysisStore(s => s.dispose)

  useEffect(() => {
    init()
    return () => dispose()
  }, [init, dispose])

  return (
    <div className="analysis-workspace">
      <WorkspaceHeader />

      <SignalAnalyzer />

      <div className="ws-body">
        {mode === 'smart' && (
          <>
            <ActivityConsole />
            <LiveMarketPanel />
          </>
        )}
        {mode === 'scanner' && (
          <div className="ws-mode-content">
            <AnalysisToolScanner />
          </div>
        )}
        {mode === 'circles' && (
          <div className="ws-mode-content">
            <DigitCirclesView />
          </div>
        )}
      </div>

      <RunControl />

      <RiskDisclaimerBar />

      <AIAssistant />

      <AnalysisModal />
    </div>
  )
}
