import BotBlockly from '../../components/BotBlockly'

export default function BotBuilderTab() {
  return (
    <div className="tab-content">
      <div className="tab-content__header">
        <h2 className="tab-content__title">Bot Builder</h2>
        <p className="tab-content__subtitle">Create and customize your trading bots using visual blocks</p>
      </div>
      <BotBlockly />
    </div>
  )
}
