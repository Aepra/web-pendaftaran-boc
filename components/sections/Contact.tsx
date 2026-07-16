export default function Contact() {
  return (
    <section id="contact" className="relative w-full bg-white/75 backdrop-blur-[2px] py-20 md:py-28">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-[#700702] mb-4 bg-[#700702]/8 px-3 py-1 rounded-full border border-[#700702]/15">
            Command Center
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#002D61] leading-[1.15]">
            Kontak Kami
          </h2>
          <p className="text-base sm:text-lg text-[#002D61]/60 mt-4 max-w-xl mx-auto">
            Butuh bantuan? Tim support kami siap merespons pertanyaan Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {/* WhatsApp Card */}
          <div className="group p-8 rounded-2xl border border-[#002D61]/10 bg-[#FFF6E9] hover:border-[#002D61]/25 hover:shadow-lg transition-all duration-300 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-green-500/10 text-green-600 mb-5 group-hover:scale-110 transition-all duration-300 shadow-sm">
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-[#002D61] mb-2">WhatsApp Support</h3>
            <p className="text-xs text-[#002D61]/50 mb-1">Senin – Sabtu, 08.00 – 20.00 WITA</p>
            <p className="text-xs text-green-600/80 mb-4">Response: &lt; 30 menit</p>
            <div className="flex flex-col gap-3 items-center">
              <a
                href="https://wa.me/6282244724337"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-[#700702] font-semibold hover:text-[#8a0903] text-sm transition-colors"
              >
                Atika: 0822-4472-4337
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
              <a
                href="https://wa.me/6285966407041"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-[#700702] font-semibold hover:text-[#8a0903] text-sm transition-colors"
              >
                Vira: 0859-6640-7041
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>

          {/* Email Card */}
          <div className="group p-8 rounded-2xl border border-[#002D61]/10 bg-[#FFF6E9] hover:border-[#002D61]/25 hover:shadow-lg transition-all duration-300 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#002D61]/8 text-[#002D61] mb-5 group-hover:scale-110 transition-all duration-300 shadow-sm">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-[#002D61] mb-2">Email Support</h3>
            <p className="text-xs text-[#002D61]/50 mb-1">24/7</p>
            <p className="text-xs text-[#002D61]/60 mb-4">Response: &lt; 24 jam</p>
            <a
              href="mailto:battleofchampions17@gmail.com"
              className="inline-flex items-center gap-2 text-[#700702] font-semibold hover:text-[#8a0903] text-sm transition-colors"
            >
              battleofchampions17@gmail.com
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>

        {/* Instagram CTA */}
        <div className="mt-10 text-center">
          <p className="text-sm text-[#002D61]/60 mb-3">Ikuti kami untuk update terbaru:</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://instagram.com/youthverse.id"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#700702]/20 bg-[#700702]/5 text-[#700702] font-semibold text-sm hover:bg-[#700702]/10 hover:border-[#700702]/35 transition-all"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
              @youthverse.id
            </a>
            <a
              href="https://instagram.com/battleofchampions_"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#700702]/20 bg-[#700702]/5 text-[#700702] font-semibold text-sm hover:bg-[#700702]/10 hover:border-[#700702]/35 transition-all"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
              @battleofchampions_
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}