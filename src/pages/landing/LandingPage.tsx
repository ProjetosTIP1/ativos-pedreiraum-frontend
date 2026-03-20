import React, { useEffect } from "react";
import { useAssetStore } from "../../stores/useAssetStore";
import { AssetCard } from "../../components/assets/AssetCard";
import { Button } from "../../components/ui/Button";
import { AssetImage } from "../../components/ui/AssetImage";
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
      <section className={style.hero}>
        <div className={style.heroBg}>
          <AssetImage
            src="/images/hero-industrial.jpg"
            alt="Grupo Pedreira Um Valemix"
            className={style.heroImage}
            fallback="/images/image-placeholder.png"
          />
        </div>

        <div className={style.heroContent}>
          <div className={style.heroTextWrapper}>
            <span className={style.heroBadge}>Grupo Pedreira Um Valemix</span>
            <h1 className={style.heroTitle}>
              Potência que <span className={style.heroHighlight}>Constrói</span>{" "}
              o Futuro
            </h1>
            <p className={style.heroDescription}>
              O maior catálogo de equipamentos, máquinas e peças usadas de alta
              performance para mineração e infraestrutura pesada.
            </p>
            <div className={style.heroActions}>
              <Button
                onClick={() => navigate("/ativos")}
                size="lg"
                className={style.heroActionButton}
              >
                Explorar Catálogo{" "}
                <ArrowRight className={style.actionButtonIcon} size={20} />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() =>
                  window.scrollTo({ top: 800, behavior: "smooth" })
                }
              >
                Nossa Expertise
              </Button>
            </div>
          </div>
        </div>

        {/* Diagonal Decorator */}
        <div className={style.heroDecorator}></div>
      </section>

      {/* Features Section */}
      <section className={style.section}>
        <div className={style.featuresGrid}>
          {[
            {
              icon: <ShieldCheck size={40} />,
              title: "Qualidade Garantida",
              text: "Ativos rigorosamente revisados por especialistas técnicos certificados.",
            },
            {
              icon: <Truck size={40} />,
              title: "Pronta Entrega",
              text: "Equipamentos em estoque real, disponíveis para logística imediata.",
            },
            {
              icon: <HardHat size={40} />,
              title: "DNA Valemix",
              text: "A solidez e autoridade de quem lidera o mercado de mineração nacional.",
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
          <h2 className={style.sectionTitle}>
            Equipamentos em <span className={style.sectionTitleHighlight}>Destaque</span>
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/ativos")}
            className="text-xs"
          >
            Ver Catálogo <ArrowRight size={14} className="ml-2" />
          </Button>
        </div>

        {isLoading ? (
          <div className={style.highlightsGrid}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={style.loadingSkeleton}></div>
            ))}
          </div>
        ) : (
          <div className={style.highlightsGrid}>
            {featuredAssets.length > 0 ? (
              featuredAssets.map((asset) => (
                <AssetCard key={asset.id} asset={asset} />
              ))
            ) : (
              <div className={style.emptyState}>
                <p className={style.emptyText}>
                  Nenhum ativo disponível em destaque
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-6"
                  onClick={() => navigate("/ativos")}
                >
                  Ver Todos os Ativos
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
            <h2 className={style.ctaTitle}>Soluções Customizadas?</h2>
            <p className={style.ctaSubtitle}>
              Nossa equipe de consultoria técnica está pronta para apoiar seu projeto.
            </p>
          </div>
          <Button
            variant="secondary"
            size="lg"
            onClick={() =>
              window.open(
                `https://wa.me/${import.meta.env.VITE_COMPANY_CONSULTOR_CONTACT}?text=${encodeURIComponent(`Olá, gostaria de falar com um consultor sobre os ativos disponíveis no catálogo da Pedreira Um Valemix.`)}`,
                "_blank",
              )
            }
          >
            Falar com Especialista
          </Button>

          {/* Decorative Elements */}
          <div className={style.ctaDecoratorCircle}></div>
          <div className={style.ctaDecoratorSquare}></div>
        </div>
      </section>
    </div>
  );
};

