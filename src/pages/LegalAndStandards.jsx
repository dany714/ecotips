import { useState } from 'react';
import { Shield, ScrollText, Scale, TrendingUp, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function LegalAndStandards() {
    const { lang } = useLanguage();
    const [activeTab, setActiveTab] = useState('privacidad');

    const tabs = [
        { id: 'privacidad', label: { es: 'Aviso de Privacidad', en: 'Privacy Notice' }, icon: <Scale size={16} /> },
        { id: 'deslinde', label: { es: 'Deslinde', en: 'Disclaimer' }, icon: <AlertTriangle size={16} /> },
        { id: 'normativas', label: { es: 'Conformidad', en: 'Compliance' }, icon: <Shield size={16} /> },
        { id: 'metodologia', label: { es: 'Investigación', en: 'Research' }, icon: <TrendingUp size={16} /> },
    ];

    const H2 = ({ children }) => (
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#111', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            {children}
        </h2>
    );
    const H3 = ({ children }) => (
        <h3 style={{ fontWeight: 700, fontSize: '1.05rem', marginTop: '20px', marginBottom: '10px', color: '#1f2937' }}>{children}</h3>
    );
    const P = ({ children }) => <p style={{ color: '#4b5563', lineHeight: 1.6, fontSize: '0.9rem', marginBottom: '12px' }}>{children}</p>;
    const UL = ({ items }) => (
        <ul style={{ color: '#4b5563', fontSize: '0.9rem', lineHeight: 1.6, margin: '0 0 12px', paddingLeft: '20px' }}>
            {items.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
    );

    // ─── DESLINDE ────────────────────────────────────────────
    const Deslinde = () => lang === 'es' ? (
        <div className="animate-fade">
            <H2><AlertTriangle color="var(--primary)" /> Deslinde de Responsabilidades – EcoTips</H2>
            <H3>1. Información general</H3>
            <P>EcoTips es una aplicación web destinada a la publicación, gestión y difusión de tips relacionados con la sustentabilidad, incluyendo prácticas de reciclaje, ahorro de agua, uso eficiente de la energía y otras acciones orientadas al cuidado del medio ambiente.</P>
            <P>La plataforma tiene como objetivo promover la educación ambiental, la participación comunitaria y la difusión de buenas prácticas sustentables, permitiendo que los usuarios compartan experiencias, recomendaciones y consejos.</P>
            <P>La información publicada en la plataforma tiene fines informativos, educativos y de concientización ambiental, y <strong>no sustituye asesoría profesional</strong> especializada en materia ambiental, técnica o científica.</P>
            <P>El uso del sistema EcoTips se rige bajo una modalidad de "Foro Abierto Moderado", en la cual los usuarios registrados pueden generar contenido dentro de la plataforma. Al acceder y utilizar el sistema, el usuario acepta de manera expresa las presentes eximentes y limitaciones de responsabilidad.</P>

            <H3>2. Tipos de usuarios y funcionalidades</H3>
            <P>Dentro de la plataforma existen dos tipos de usuarios:</P>
            <UL items={[
                <><strong>Usuarios no registrados:</strong> Pueden visualizar y consultar el contenido público publicado dentro de la plataforma.</>,
                <><strong>Usuarios registrados:</strong> Pueden publicar tips sustentables, editar o eliminar sus propios tips, reaccionar a publicaciones, comentar publicaciones, guardar tips dentro de su cuenta y reportar contenido que consideren inapropiado.</>
            ]} />

            <H3>3. Contenido generado por terceros</H3>
            <P>Las aseveraciones, descripciones ecológicas, consejos, comentarios o material multimedia compartido dentro de los tips son <strong>responsabilidad exclusiva del usuario que los publica</strong>.</P>
            <P>EcoTips actúa únicamente como intermediario tecnológico de difusión de contenido, por lo que no funge como autor, editor ni responsable directo de la información publicada por terceros. En consecuencia, EcoTips no garantiza la veracidad, exactitud, confiabilidad o actualidad de la información publicada por los usuarios.</P>

            <H3>4. Uso de la información publicada</H3>
            <P>Los consejos y recomendaciones compartidos dentro de la plataforma tienen fines informativos, educativos y de concientización ambiental. Algunos tips pueden funcionar como guías prácticas; sin embargo, <strong>cada usuario es responsable de evaluar la pertinencia, seguridad y viabilidad</strong> de aplicar dichas recomendaciones.</P>

            <H3>5. Moderación comunitaria</H3>
            <P>La plataforma opera bajo un modelo de moderación comunitaria. Aunque se implementan medidas de seguridad basadas en buenas prácticas tecnológicas y estándares internacionales como ISO/IEC 27001, <strong>el contenido publicado por los usuarios no pasa por un proceso de revisión humana previa</strong> antes de hacerse público.</P>

            <H3>6. Suspensión de cuentas y contenido</H3>
            <P>El administrador del sistema se reserva el derecho de editar, restringir o eliminar contenido, así como suspender cuentas de usuario, cuando se detecte contenido que incluya:</P>
            <UL items={['Apología al odio', 'Contenido ofensivo, discriminatorio u obsceno', 'Difamación o ataques personales', 'Spam masivo o flooding', 'Contenido engañoso o perjudicial', 'Contenido ilegal o que infrinja la legislación vigente', 'Publicaciones que contravengan los principios de sustentabilidad ambiental promovidos por la plataforma']} />

            <H3>7. Registro y datos de usuario</H3>
            <P>Para acceder a ciertas funcionalidades, los usuarios pueden registrarse proporcionando información como nombre, correo electrónico y contraseña. Los usuarios son responsables de proporcionar información verídica y de mantener la confidencialidad de sus credenciales de acceso.</P>

            <H3>8. Continuidad del servicio</H3>
            <P>EcoTips no garantiza la disponibilidad permanente del sistema ni la conservación indefinida de los registros. El funcionamiento puede depender de servicios externos como Firebase.</P>

            <H3>9. Aceptación del deslinde</H3>
            <P>El acceso y uso de la plataforma EcoTips implica que el usuario ha leído, comprendido y aceptado el presente deslinde de responsabilidades.</P>
        </div>
    ) : (
        <div className="animate-fade">
            <H2><AlertTriangle color="var(--primary)" /> Disclaimer – EcoTips</H2>
            <H3>1. General information</H3>
            <P>EcoTips is a web application designed for the publication, management, and dissemination of sustainability-related tips, including recycling practices, water conservation, energy efficiency, and other environmentally friendly actions.</P>
            <P>The platform aims to promote environmental education, community participation, and the spread of sustainable best practices, allowing users to share experiences, recommendations, and advice.</P>
            <P>The information published on the platform is for informational, educational, and environmental awareness purposes only, and <strong>does not replace professional advice</strong> in environmental, technical, or scientific matters.</P>
            <P>By accessing and using EcoTips, the user expressly accepts these disclaimers and liability limitations. The system operates as a "Moderated Open Forum."</P>

            <H3>2. User types and features</H3>
            <P>The platform has two types of users:</P>
            <UL items={[
                <><strong>Unregistered users:</strong> Can view and browse public content published on the platform.</>,
                <><strong>Registered users:</strong> Can publish sustainable tips, edit or delete their own tips, react to posts, comment, save tips, and report inappropriate content.</>
            ]} />

            <H3>3. Third-party generated content</H3>
            <P>The assertions, ecological descriptions, advice, comments, or multimedia material shared within tips are <strong>the sole responsibility of the user who publishes them</strong>.</P>
            <P>EcoTips acts only as a technological intermediary for content dissemination and is not the author, editor, or directly responsible for information published by third parties.</P>

            <H3>4. Use of published information</H3>
            <P>Advice shared on the platform is for informational and educational purposes. Some tips may serve as practical guides; however, <strong>each user is responsible for evaluating the relevance, safety, and viability</strong> of applying such recommendations.</P>

            <H3>5. Community moderation</H3>
            <P>The platform operates under a community moderation model. Although security measures aligned with international standards such as ISO/IEC 27001 are implemented, <strong>user-published content does not undergo prior human review</strong> before becoming public.</P>

            <H3>6. Account and content suspension</H3>
            <P>The system administrator reserves the right to edit, restrict, or remove content, as well as suspend user accounts, when content includes:</P>
            <UL items={['Hate speech', 'Offensive, discriminatory, or obscene content', 'Defamation or personal attacks', 'Mass spam or flooding', 'Misleading or harmful content', 'Illegal content or content that violates applicable law', 'Posts contrary to the environmental sustainability principles promoted by the platform']} />

            <H3>7. User registration and data</H3>
            <P>To access certain features, users may register by providing information such as name, email address, and password. Users are responsible for providing truthful information and maintaining the confidentiality of their access credentials.</P>

            <H3>8. Service continuity</H3>
            <P>EcoTips does not guarantee permanent system availability or indefinite record retention. Operation may depend on external services such as Firebase.</P>

            <H3>9. Acceptance of disclaimer</H3>
            <P>Accessing and using the EcoTips platform implies that the user has read, understood, and accepted this disclaimer.</P>
        </div>
    );

    // ─── PRIVACIDAD ──────────────────────────────────────────
    const Privacidad = () => lang === 'es' ? (
        <div className="animate-fade">
            <H2><Scale color="var(--primary)" /> Aviso de Privacidad – EcoTips</H2>
            <H3>1. Responsable del tratamiento de datos</H3>
            <P>EcoTips, como plataforma tecnológica de divulgación sustentable, es la entidad responsable del tratamiento de los datos personales recopilados a través de este sistema, operando conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP) y su Reglamento.</P>

            <H3>2. Datos personales recabados</H3>
            <P>A través del proceso de registro y uso de la plataforma, se recaban los siguientes datos personales:</P>
            <UL items={['Nombre completo', 'Dirección de correo electrónico', 'Contraseña (almacenada de forma cifrada)', 'Tipo de usuario (institución educativa, empresa u organización)', 'Estado o entidad de procedencia', 'Contenido generado por el usuario (tips, comentarios, reacciones)']} />

            <H3>3. Finalidades del tratamiento</H3>
            <P>Los datos personales recabados serán utilizados para las siguientes finalidades primarias:</P>
            <UL items={['Creación y gestión de cuentas de usuario', 'Autenticación y control de acceso al sistema', 'Personalización de la experiencia dentro de la plataforma', 'Gestión de contenidos publicados por los usuarios', 'Envío de notificaciones relacionadas con la actividad en la plataforma']} />

            <H3>4. Transferencia de datos</H3>
            <P>EcoTips no comercializa, vende, ni cede los datos personales de sus usuarios a terceros con fines comerciales. Los datos podrán ser compartidos únicamente con proveedores tecnológicos necesarios para la operación del sistema, como Firebase (Google), conforme a sus propias políticas de privacidad y los términos de uso.</P>

            <H3>5. Derechos ARCO</H3>
            <P>Todo usuario tiene derecho a ejercer sus derechos de Acceso, Rectificación, Cancelación u Oposición (derechos ARCO) respecto de sus datos personales. Para ello, el usuario puede editar su perfil directamente desde la plataforma o ponerse en contacto con el administrador del sistema.</P>

            <H3>6. Seguridad de los datos</H3>
            <P>EcoTips implementa medidas de seguridad técnicas, administrativas y físicas para proteger los datos personales de los usuarios contra acceso no autorizado, pérdida, alteración o divulgación indebida, utilizando protocolos estándar de la industria como el cifrado SSL/TLS y las salvaguardas de seguridad proporcionadas por Firebase Authentication.</P>

            <H3>7. Cambios al aviso de privacidad</H3>
            <P>EcoTips se reserva el derecho de modificar el presente aviso de privacidad. Cualquier cambio significativo será notificado a los usuarios a través de la propia plataforma.</P>
        </div>
    ) : (
        <div className="animate-fade">
            <H2><Scale color="var(--primary)" /> Privacy Notice – EcoTips</H2>
            <H3>1. Data controller</H3>
            <P>EcoTips, as a sustainable technology dissemination platform, is responsible for processing the personal data collected through this system, operating in accordance with applicable data protection legislation.</P>

            <H3>2. Personal data collected</H3>
            <P>Through the registration and platform use process, the following personal data is collected:</P>
            <UL items={['Full name', 'Email address', 'Password (stored in encrypted form)', 'User type (educational institution, company, or organization)', 'State or region of origin', 'User-generated content (tips, comments, reactions)']} />

            <H3>3. Purposes of processing</H3>
            <P>Collected personal data will be used for the following primary purposes:</P>
            <UL items={['Creating and managing user accounts', 'Authentication and access control', 'Personalizing the platform experience', 'Managing user-published content', 'Sending notifications related to platform activity']} />

            <H3>4. Data transfers</H3>
            <P>EcoTips does not sell or transfer user personal data to third parties for commercial purposes. Data may be shared only with technology providers necessary for system operation, such as Firebase (Google), in accordance with their own privacy policies.</P>

            <H3>5. User rights</H3>
            <P>Every user has the right to access, rectify, cancel, or object to the processing of their personal data. Users can edit their profile directly on the platform or contact the system administrator.</P>

            <H3>6. Data security</H3>
            <P>EcoTips implements technical, administrative, and physical security measures to protect user personal data against unauthorized access, loss, alteration, or improper disclosure, using industry-standard protocols such as SSL/TLS encryption and Firebase Authentication safeguards.</P>

            <H3>7. Changes to this privacy notice</H3>
            <P>EcoTips reserves the right to modify this privacy notice. Any significant changes will be notified to users through the platform.</P>
        </div>
    );

    // ─── NORMATIVAS ──────────────────────────────────────────
    const Normativas = () => lang === 'es' ? (
        <div className="animate-fade">
            <H2><Shield color="var(--primary)" /> Conformidad Operacional – EcoTips</H2>
            <H3>1. Estándares internacionales implementados</H3>
            <P>EcoTips basa su operación en principios alineados con estándares internacionales reconocidos en materia de seguridad, calidad y gestión de la información:</P>
            <UL items={[
                <><strong>ISO/IEC 27001:</strong> Gestión de Seguridad de la Información. Garantiza la confidencialidad, integridad y disponibilidad de la información.</>,
                <><strong>ISO/IEC 25010:</strong> Estándar de calidad de software. Define características de calidad aplicadas al diseño y desarrollo del sistema.</>,
                <><strong>WCAG 2.1 (Nivel AA):</strong> Accesibilidad web para garantizar la usabilidad del sistema a personas con diversas capacidades.</>,
            ]} />

            <H3>2. Políticas de uso aceptable</H3>
            <P>Los usuarios que hagan uso de la plataforma EcoTips se comprometen a cumplir con las siguientes condiciones:</P>
            <UL items={['No publicar contenido que incite al odio, discriminación o violencia', 'No compartir información falsa, engañosa o no verificada como si fuera un hecho comprobado', 'No realizar actividades de spam, phishing o cualquier práctica maliciosa', 'Respetar los derechos de propiedad intelectual de terceros', 'No realizar ingeniería inversa, modificación no autorizada o explotación de vulnerabilidades del sistema']} />

            <H3>3. Responsabilidad del usuario</H3>
            <P>El usuario es el único responsable del contenido que publique dentro de la plataforma. EcoTips se reserva el derecho de suspender o cancelar cuentas de usuarios que infrinjan estas políticas, sin previo aviso y sin responsabilidad alguna para la plataforma.</P>

            <H3>4. Propiedad intelectual</H3>
            <P>EcoTips y su diseño, arquitectura, código fuente y elementos gráficos son propiedad del equipo de desarrollo que lo creó. El contenido generado por los usuarios dentro de la plataforma es propiedad de sus respectivos autores, quienes otorgan una licencia limitada a EcoTips para mostrar y distribuir dicho contenido dentro de la plataforma.</P>

            <H3>5. Actualizaciones del sistema</H3>
            <P>EcoTips puede actualizar, modificar o descontinuar funcionalidades de la plataforma en cualquier momento sin previo aviso. Se esforzará por notificar cambios relevantes a sus usuarios cuando sea posible.</P>
        </div>
    ) : (
        <div className="animate-fade">
            <H2><Shield color="var(--primary)" /> Operational Compliance – EcoTips</H2>
            <H3>1. Implemented international standards</H3>
            <P>EcoTips bases its operation on principles aligned with internationally recognized standards in security, quality, and information management:</P>
            <UL items={[
                <><strong>ISO/IEC 27001:</strong> Information Security Management. Ensures confidentiality, integrity, and availability of information.</>,
                <><strong>ISO/IEC 25010:</strong> Software quality standard. Defines quality characteristics applied to system design and development.</>,
                <><strong>WCAG 2.1 (Level AA):</strong> Web accessibility to ensure usability for people with diverse abilities.</>,
            ]} />

            <H3>2. Acceptable use policies</H3>
            <P>Users of the EcoTips platform agree to comply with the following conditions:</P>
            <UL items={['Do not publish content that incites hatred, discrimination, or violence', 'Do not share false, misleading, or unverified information as if it were fact', 'Do not engage in spam, phishing, or any malicious practices', 'Respect third-party intellectual property rights', 'Do not reverse-engineer, unauthorized modify, or exploit vulnerabilities in the system']} />

            <H3>3. User responsibility</H3>
            <P>The user is solely responsible for the content they publish on the platform. EcoTips reserves the right to suspend or cancel user accounts that violate these policies, without prior notice and without any liability to the platform.</P>

            <H3>4. Intellectual property</H3>
            <P>EcoTips, its design, architecture, source code, and graphic elements are the property of its development team. User-generated content on the platform is the property of its respective authors, who grant EcoTips a limited license to display and distribute such content within the platform.</P>

            <H3>5. System updates</H3>
            <P>EcoTips may update, modify, or discontinue platform features at any time without notice, and will strive to notify users of relevant changes when possible.</P>
        </div>
    );

    // ─── METODOLOGÍA ────────────────────────────────────────────
    const Metodologia = () => lang === 'es' ? (
        <div className="animate-fade">
            <H2><TrendingUp color="var(--primary)" /> Investigación Aplicada – EcoTips</H2>
            <H3>1. Enfoque metodológico</H3>
            <P>EcoTips surge como resultado de un proceso de investigación aplicada orientado al diseño, desarrollo e implementación de sistemas de información sostenibles. El proyecto integra principios de ingeniería de software, diseño centrado en el usuario y educación ambiental para la construcción de una plataforma de impacto social.</P>

            <H3>2. Fundamentos tecnológicos</H3>
            <P>La plataforma ha sido desarrollada utilizando tecnologías web modernas que garantizan escalabilidad, rendimiento y accesibilidad:</P>
            <UL items={[
                <><strong>Frontend:</strong> React.js con Vite como herramienta de compilación, aplicando principios de diseño modular y componentización.</>,
                <><strong>Backend y base de datos:</strong> Firebase (Google Cloud), utilizado para autenticación, almacenamiento en tiempo real (Firestore) y hospedaje.</>,
                <><strong>Seguridad:</strong> Implementación de reglas de Firestore para control de acceso, autenticación mediante correo electrónico y contraseña con Firebase Authentication.</>,
            ]} />

            <H3>3. Modelo de moderación</H3>
            <P>El sistema implementa un modelo de moderación mixto que combina la participación activa de la comunidad con la supervisión de moderadores designados. Este modelo busca garantizar la calidad, veracidad y pertinencia ambiental del contenido publicado en la plataforma.</P>

            <H3>4. Métricas de calidad</H3>
            <P>El sistema es evaluado periódicamente con base en métricas de calidad definidas según el estándar ISO/IEC 25010:</P>
            <UL items={['Funcionalidad: Capacidad del sistema de cumplir sus objetivos definidos', 'Rendimiento: Tiempo de respuesta y eficiencia en el procesamiento de datos', 'Usabilidad: Facilidad de navegación, comprensión e interacción por parte del usuario', 'Fiabilidad: Estabilidad del sistema y manejo de errores', 'Seguridad: Protección de datos, autenticación y autorización', 'Mantenibilidad: Facilidad para actualizar, escalar y adaptar el sistema']} />

            <H3>5. Alcance y proyección</H3>
            <P>EcoTips es concebida como una plataforma de escala regional con potencial de expansión nacional, orientada a comunidades educativas, organizaciones ambientales, empresas comprometidas con la sustentabilidad y ciudadanos en general interesados en adoptar prácticas ecológicas.</P>
        </div>
    ) : (
        <div className="animate-fade">
            <H2><TrendingUp color="var(--primary)" /> Applied Research – EcoTips</H2>
            <H3>1. Methodological approach</H3>
            <P>EcoTips is the result of an applied research process focused on the design, development, and implementation of sustainable information systems. The project integrates software engineering principles, user-centered design, and environmental education to build a socially impactful platform.</P>

            <H3>2. Technological foundations</H3>
            <P>The platform was developed using modern web technologies that ensure scalability, performance, and accessibility:</P>
            <UL items={[
                <><strong>Frontend:</strong> React.js with Vite as the build tool, applying modular design and componentization principles.</>,
                <><strong>Backend & database:</strong> Firebase (Google Cloud), used for authentication, real-time storage (Firestore), and hosting.</>,
                <><strong>Security:</strong> Firestore rules for access control, email/password authentication with Firebase Authentication.</>,
            ]} />

            <H3>3. Moderation model</H3>
            <P>The system implements a mixed moderation model combining active community participation with designated moderator oversight, aiming to ensure quality, accuracy, and environmental relevance of published content.</P>

            <H3>4. Quality metrics</H3>
            <P>The system is periodically evaluated based on quality metrics defined by the ISO/IEC 25010 standard:</P>
            <UL items={['Functionality: Ability of the system to meet its defined objectives', 'Performance: Response time and data processing efficiency', 'Usability: Ease of navigation, understanding, and interaction', 'Reliability: System stability and error handling', 'Security: Data protection, authentication, and authorization', 'Maintainability: Ease of updating, scaling, and adapting the system']} />

            <H3>5. Scope and projection</H3>
            <P>EcoTips is conceived as a regional-scale platform with national expansion potential, targeting educational communities, environmental organizations, sustainability-focused companies, and citizens interested in adopting ecological practices.</P>
        </div>
    );

    return (
        <div style={{ padding: '0 24px 40px', maxWidth: '860px', margin: '0 auto' }}>
            <div className="card" style={{ margin: '20px 0', padding: '24px 20px', textAlign: 'center', background: 'linear-gradient(135deg, #065f46, var(--primary))', color: 'white' }}>
                <div style={{ background: 'rgba(255,255,255,0.15)', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                    <ScrollText size={24} />
                </div>
                <h1 style={{ fontWeight: 800, fontSize: '1.5rem', margin: '0 0 6px' }}>
                    {lang === 'es' ? 'Normas y Privacidad' : 'Standards & Privacy'}
                </h1>
                <p style={{ margin: '0 auto', color: 'rgba(255,255,255,0.85)', fontSize: '0.85rem', maxWidth: '600px', lineHeight: 1.4 }}>
                    {lang === 'es'
                        ? 'Documentación oficial sobre eximentes de responsabilidad, legislación de privacidad, estándares de cumplimiento y lineamientos rectores de Eco Tips.'
                        : 'Official documentation on disclaimers, privacy legislation, compliance standards, and governing guidelines for Eco Tips.'}
                </p>
            </div>

            <div style={{ display: 'flex', gap: '8px', background: 'rgba(255,255,255,0.6)', borderRadius: '12px', padding: '6px', marginBottom: '24px', overflowX: 'auto' }}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            padding: '10px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                            background: activeTab === tab.id ? 'white' : 'transparent',
                            color: activeTab === tab.id ? 'var(--primary)' : '#6b7280',
                            fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px',
                            boxShadow: activeTab === tab.id ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                            transition: 'all 0.15s', whiteSpace: 'nowrap', flex: 1, justifyContent: 'center'
                        }}
                    >
                        {tab.icon} {tab.label[lang]}
                    </button>
                ))}
            </div>

            <div className="card" style={{ padding: '32px' }}>
                {activeTab === 'deslinde' && <Deslinde />}
                {activeTab === 'privacidad' && <Privacidad />}
                {activeTab === 'normativas' && <Normativas />}
                {activeTab === 'metodologia' && <Metodologia />}
            </div>
        </div>
    );
}
