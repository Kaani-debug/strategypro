import { useEffect } from 'react'

export default function LiveChat() {
  useEffect(() => {
    const initLiveChat = () => {
      window.__lc = window.__lc || {}
      window.__lc.license = 12049137
      window.__lc.asyncInit = true

      const lc = {
        _q: [], _h: null, _v: '2.0',
        on: function () { lc._q.push(['on', [].slice.call(arguments)]) },
        once: function () { lc._q.push(['once', [].slice.call(arguments)]) },
        off: function () { lc._q.push(['off', [].slice.call(arguments)]) },
        get: function () { if (!lc._h) throw new Error('[LiveChatWidget] You can\'t use getters before load.'); return lc._q.push(['get', [].slice.call(arguments)]) },
        call: function () { lc._q.push(['call', [].slice.call(arguments)]) },
        init: function () {
          setTimeout(() => {
            const s = document.createElement('script')
            s.async = true
            s.type = 'text/javascript'
            s.src = 'https://cdn.livechatinc.com/tracking.js'
            document.head.appendChild(s)
          }, 3000)
        },
      }

      if (!window.__lc.asyncInit) lc.init()
      window.LiveChatWidget = window.LiveChatWidget || lc
    }

    initLiveChat()
  }, [])

  return null
}
