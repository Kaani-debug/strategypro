import { useEffect, useRef, useState } from 'react'
import * as Blockly from 'blockly'
import { javascriptGenerator } from 'blockly/javascript'
import 'blockly/blocks'

export default function BotBlockly({ onCodeGenerated, onStrategyChange }) {
  const workspaceRef = useRef(null)
  const containerRef = useRef(null)
  const [selected, setSelected] = useState('')

  useEffect(() => {
    if (!containerRef.current || workspaceRef.current) return

    Blockly.defineBlocksWithJsonArray([
      {
        type: 'trade_rise_fall',
        message0: 'Trade %1 if %2 after %3 ticks',
        args0: [
          { type: 'field_dropdown', name: 'SYMBOL', options: [['Vol 10', 'Vol 10'], ['Vol 25', 'Vol 25'], ['Vol 50', 'Vol 50'], ['Vol 75', 'Vol 75'], ['Vol 100', 'Vol 100'], ['Bull Market', 'Bull Market'], ['Bear Market', 'Bear Market']] },
          { type: 'field_dropdown', name: 'TYPE', options: [['Rise', 'Rise'], ['Fall', 'Fall'], ['Match', 'Match'], ['Differ', 'Differ']] },
          { type: 'field_number', name: 'TICKS', value: 5, min: 1, max: 100 },
        ],
        previousStatement: null,
        nextStatement: null,
        colour: 45,
        tooltip: 'Place a Rise/Fall trade',
        helpUrl: '',
      },
      {
        type: 'trade_digit',
        message0: 'Trade %1 digit %2 %3 stake $%4',
        args0: [
          { type: 'field_dropdown', name: 'SYMBOL', options: [['Vol 10', 'Vol 10'], ['Vol 25', 'Vol 25'], ['Vol 50', 'Vol 50']] },
          { type: 'field_dropdown', name: 'TYPE', options: [['Matches', 'Matches'], ['Differs', 'Differs'], ['Even', 'Even'], ['Odd', 'Odd'], ['Over', 'Over'], ['Under', 'Under']] },
          { type: 'field_number', name: 'DIGIT', value: 5, min: 0, max: 9 },
          { type: 'field_number', name: 'STAKE', value: 10, min: 1 },
        ],
        previousStatement: null,
        nextStatement: null,
        colour: 210,
        tooltip: 'Trade based on last digit',
        helpUrl: '',
      },
      {
        type: 'strategy_martingale',
        message0: 'Martingale: %1 stake $%2 max %3 steps profit $%4',
        args0: [
          { type: 'field_dropdown', name: 'SYMBOL', options: [['Vol 10', 'Vol 10'], ['Vol 25', 'Vol 25'], ['Vol 50', 'Vol 50'], ['Vol 75', 'Vol 75']] },
          { type: 'field_number', name: 'STAKE', value: 10, min: 1 },
          { type: 'field_number', name: 'STEPS', value: 5, min: 1, max: 20 },
          { type: 'field_number', name: 'PROFIT', value: 50, min: 1 },
        ],
        previousStatement: null,
        nextStatement: null,
        colour: 120,
        tooltip: 'Martingale strategy - double after loss',
        helpUrl: '',
      },
      {
        type: 'strategy_dalembert',
        message0: "D'Alembert: %1 stake $%2 unit $%3 max loss $%4",
        args0: [
          { type: 'field_dropdown', name: 'SYMBOL', options: [['Vol 10', 'Vol 10'], ['Vol 25', 'Vol 25'], ['Vol 50', 'Vol 50']] },
          { type: 'field_number', name: 'STAKE', value: 10, min: 1 },
          { type: 'field_number', name: 'UNIT', value: 2, min: 1 },
          { type: 'field_number', name: 'MAXLOSS', value: 100, min: 1 },
        ],
        previousStatement: null,
        nextStatement: null,
        colour: 285,
        tooltip: "D'Alembert strategy - adjust by unit",
        helpUrl: '',
      },
      {
        type: 'controls_repeat_trades',
        message0: 'repeat %1 times %2 %3',
        args0: [
          { type: 'field_number', name: 'TIMES', value: 10, min: 1 },
          { type: 'input_statement', name: 'DO' },
          null,
        ],
        previousStatement: null,
        nextStatement: null,
        colour: 330,
        tooltip: 'Repeat trades multiple times',
        helpUrl: '',
      },
      {
        type: 'trade_on_condition',
        message0: 'when %1 %2 %3 then %4',
        args0: [
          { type: 'field_dropdown', name: 'SYMBOL', options: [['Vol 10', 'Vol 10'], ['Vol 25', 'Vol 25'], ['Vol 50', 'Vol 50']] },
          { type: 'field_dropdown', name: 'COND', options: [['Rise > 2 ticks', 'RISE2'], ['Fall > 2 ticks', 'FALL2'], ['Digit = 0-4', 'DIGIT_LOW'], ['Digit = 5-9', 'DIGIT_HIGH']] },
          { type: 'input_value', name: 'TRADE' },
          null,
        ],
        previousStatement: null,
        nextStatement: null,
        colour: 60,
        tooltip: 'Trade when condition is met',
        helpUrl: '',
      },
    ])

    const toolbox = {
      kind: 'categoryToolbox',
      contents: [
        { kind: 'category', name: 'Trading', colour: '#ff444f', contents: [
          { kind: 'block', type: 'trade_rise_fall' },
          { kind: 'block', type: 'trade_digit' },
          { kind: 'block', type: 'trade_on_condition' },
        ]},
        { kind: 'category', name: 'Strategies', colour: '#4bb4b3', contents: [
          { kind: 'block', type: 'strategy_martingale' },
          { kind: 'block', type: 'strategy_dalembert' },
          { kind: 'block', type: 'controls_repeat_trades' },
        ]},
        { kind: 'category', name: 'Logic', colour: '#377cfc', contents: [
          { kind: 'block', type: 'controls_if' },
          { kind: 'block', type: 'logic_compare' },
          { kind: 'block', type: 'logic_operation' },
          { kind: 'block', type: 'logic_boolean' },
        ]},
        { kind: 'category', name: 'Math', colour: '#ffad3a', contents: [
          { kind: 'block', type: 'math_arithmetic' },
          { kind: 'block', type: 'math_number' },
          { kind: 'block', type: 'math_single' },
          { kind: 'block', type: 'math_round' },
        ]},
        { kind: 'category', name: 'Variables', colour: '#85acb0', contents: [
          { kind: 'block', type: 'variables_get' },
          { kind: 'block', type: 'variables_set' },
        ]},
      ],
    }

    const ws = Blockly.inject(containerRef.current, {
      toolbox,
      grid: { spacing: 20, length: 3, colour: '#ccc', snap: true },
      zoom: { controls: true, wheel: true, startScale: 0.9, pinch: true },
      trashcan: true,
      move: { scrollbars: true, drag: true, wheel: true },
      theme: Blockly.Theme.defineTheme('strategypro', {
        base: Blockly.Themes.Classic,
        componentStyles: { workspaceBackgroundColour: '#f8f9fa', toolboxBackgroundColour: '#0e0e0e', flyoverBackgroundColour: '#252827', scrollbarColour: '#d6dadb' },
        fontStyle: { family: 'IBM Plex Sans, sans-serif', weight: '500', size: 12 },
      }),
    })

    ws.addChangeListener(() => {
      const code = javascriptGenerator.workspaceToCode(ws)
      if (onCodeGenerated) onCodeGenerated(code)
      const blocks = ws.getAllBlocks(false)
      if (onStrategyChange) onStrategyChange(blocks.map(b => ({ type: b.type, id: b.id })))
    })

    // Load default blocks
    const martingale = ws.newBlock('strategy_martingale')
    martingale.setFieldValue('Vol 10', 'SYMBOL')
    martingale.setFieldValue('10', 'STAKE')
    martingale.setFieldValue('5', 'STEPS')
    martingale.setFieldValue('50', 'PROFIT')
    martingale.initSvg()
    martingale.render()
    martingale.moveBy(50, 50)

    const repeat = ws.newBlock('controls_repeat_trades')
    repeat.setFieldValue('10', 'TIMES')
    repeat.initSvg()
    repeat.render()
    repeat.moveBy(350, 50)

    ws.resize()

    workspaceRef.current = ws
  }, [])

  const getCode = () => {
    if (!workspaceRef.current) return ''
    return javascriptGenerator.workspaceToCode(workspaceRef.current)
  }

  const clearWorkspace = () => {
    if (!workspaceRef.current) return
    workspaceRef.current.clear()
  }

  return (
    <div className="blockly-wrapper">
      <div ref={containerRef} className="blockly-container" />
      <div className="blockly-toolbar">
        <button className="btn btn--ghost" onClick={getCode}>📋 Copy Code</button>
        <button className="btn btn--ghost" onClick={clearWorkspace}>🗑️ Clear</button>
      </div>
    </div>
  )
}
