/* Edite estes dados antes de publicar. Não coloque senhas, tokens ou chaves privadas aqui. */
window.LA_BRASA_CONFIG = {
  restaurant: {
    name: "La-Brasa Churrascaria",
    phone: "5527999999999", // WhatsApp com código do país e DDD, somente números
    displayPhone: "(27) 99999-9999",
    address: "Rua Exemplo, 123 — Centro, São Gabriel da Palha - ES",
    hours: "Ter a Dom · 11h às 23h",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=La-Brasa+Churrascaria"
  },
  // Senha demonstrativa. Para uso real, implemente autenticação no Supabase/Firebase.
  localAdminPassword: "brasa123",
  currency: "BRL",
  // Defina supabaseUrl e supabaseAnonKey somente após criar o projeto Supabase.
  // A chave anon é pública por natureza: proteja os dados com RLS e políticas no banco.
  supabase: { enabled: false, url: "", anonKey: "" }
};
