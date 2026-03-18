import React, { useEffect } from "react";
import { useAssetStore } from "../../stores/useAssetStore";
import { AssetCard } from "../../components/assets/AssetCard";
import { Button } from "../../components/ui/Button";
import { ArrowRight, HardHat, ShieldCheck, Truck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import style from "./LandingPage.module.css";

export const LandingPage: React.FC = () => {
  const { featuredAssets, fetchHighlights, isLoading } = useAssetStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchHighlights();
  }, [fetchHighlights]);

  return (
    <div className={style.container}>
      {/* Hero Section */}
      <section className={style.heroSection}>
        {/* Background Overlay */}
        <div className={style.heroBackground}>
          <img
            src="/brain/4d6dea86-3b9d-4d8c-a30b-35f0a672524e/hero_industrial_machines_1773661536200.png"
            alt="Industrial Machines"
            className={style.heroImage}
          />
          <div className={style.heroOverlay}></div>
        </div>

        {/* Content */}
        <div className={style.heroContent}>
          <div className={style.heroTextWrapper}>
            <span className={style.badge}>Grupo Pedreira Um Valemix</span>
            <h1 className={style.heroTitle}>
              Potência que <span className={style.highlight}>Constrói</span> o
              Futuro
            </h1>
            <p className={style.heroDescription}>
              O maior catálogo de equipamentos, máquinas e peças usadas de alta
              performance para mineração e construção.
            </p>
            <div className={style.buttonGroup}>
              <Button
                onClick={() => navigate("/ativos")}
                size="lg"
                className="group"
              >
                Explorar Catálogo{" "}
                <ArrowRight
                  className="ml-2 transition-transform group-hover:translate-x-1"
                  size={20}
                />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() =>
                  window.scrollTo({ top: 800, behavior: "smooth" })
                }
              >
                Saiba Mais
              </Button>
            </div>
          </div>
        </div>

        {/* Diagonal Decorator */}
        <div className={style.diagonalDecorator}></div>
      </section>

      {/* Features/Stats Section */}
      <section className={style.section}>
        <div className={style.featuresGrid}>
          {[
            {
              icon: <ShieldCheck size={32} />,
              title: "Qualidade Garantida",
              text: "Ativos rigorosamente revisados pela nossa equipe técnica.",
            },
            {
              icon: <Truck size={32} />,
              title: "Pronta Entrega",
              text: "Equipamentos disponíveis para retirada imediata em nossas unidades.",
            },
            {
              icon: <HardHat size={32} />,
              title: "Suporte Valemix",
              text: "Toda a tradição e confiabilidade de quem entende de mineração.",
            },
          ].map((feature, i) => (
            <div key={i} className={style.featureCard}>
              <div className={style.featureIcon}>{feature.icon}</div>
              <h3 className={style.featureTitle}>{feature.title}</h3>
              <p className={style.featureText}>{feature.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Assets Section */}
      <section className={style.section}>
        <div className={style.sectionHeader}>
          <div>
            <h2 className={style.sectionTitle}>
              Equipamentos em <span className={style.highlight}>Destaque</span>
            </h2>
            <div className={style.titleUnderline}></div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/ativos")}
            className="text-xs"
          >
            Ver Tudo <ArrowRight size={14} className="ml-2" />
          </Button>
        </div>

        {isLoading ? (
          <div className={style.assetsGrid}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={style.skeletonCard}></div>
            ))}
          </div>
        ) : (
          <div className={style.assetsGrid}>
            {featuredAssets.length > 0 ? (
              featuredAssets.map((asset) => (
                <AssetCard key={asset.id} asset={asset} />
              ))
            ) : (
              <div className={style.emptyState}>
                <p className={style.emptyStateText}>
                  Nenhum ativo em destaque no momento
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => navigate("/ativos")}
                >
                  Ver Catálogo Completo
                </Button>
              </div>
            )}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className={style.section}>
        <div className={style.ctaSection}>
          <div className={style.ctaContent}>
            <div className={style.ctaTextWrapper}>
              <h2 className={style.ctaTitle}>Não encontrou o que procurava?</h2>
              <p className={style.ctaDescription}>
                Nossa equipe pode te ajudar a encontrar o equipamento ideal para
                sua operação.
              </p>
            </div>
            <Button
              variant="secondary"
              size="lg"
              className="border-2 border-black"
              onClick={() =>
                window.open(
                  `https://wa.me/${import.meta.env.VITE_COMPANY_CONSULTOR_CONTACT}?text=${encodeURIComponent(`Olá, gostaria de falar com um consultor sobre os ativos disponíveis no catálogo da Pedreira Um Valemix.`)}`,
                  "_blank",
                )
              }
            >
              Falar com Consultor
            </Button>
          </div>
          {/* Decorative Pattern */}
          <div className={style.ctaCircle1}></div>
          <div className={style.ctaCircle2}></div>
        </div>
      </section>
    </div>
  );
};
