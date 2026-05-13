import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Shield, Trash2, RefreshCcw, Edit2, MessageSquare, ChevronDown, ChevronUp, Flag, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import EditTipModal from '../components/EditTipModal';

export default function ModeratorDashboard() {
    const { user } = useAuth();
    const { tips, comments, reports, moderatorDeleteTip, restoreTip, deleteComment } = useData();
    const { t } = useLanguage();
    const [editingTip, setEditingTip] = useState(null);
    const [expandedTip, setExpandedTip] = useState(null);
    const [activeTab, setActiveTab] = useState('reported'); // 'reported' | 'all' | 'comments'

    if (!user || user.role !== 'moderator') return <Navigate to="/" />;

    // Reportes agrupados nativamente por Tip ID
    const reportedTips = tips.filter(t => reports.some(r => r.tipId === t.id) || t.reportsCount > 0).sort((a, b) => b.reportsCount - a.reportsCount);
    const allTips = [...tips].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const allComments = [...comments].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const currentList = activeTab === 'reported' ? reportedTips : activeTab === 'all' ? allTips : null;

    const ReportBadge = ({ tipId, count }) => {
        const externalCount = reports.filter(r => r.tipId === tipId).length;
        const total = Math.max(count, externalCount); // Lógica de retrocompatibilidad para posts antiguos sin objetos de reporte
        if (total === 0) return null;
        return (
            <span style={{
                padding: '3px 10px', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 700,
                background: total >= 10 ? '#fee2e2' : total >= 5 ? '#fef3c7' : '#f3f4f6',
                color: total >= 10 ? '#ef4444' : total >= 5 ? '#d97706' : '#6b7280',
                display: 'flex', alignItems: 'center', gap: '4px'
            }}><Flag size={12} /> {total} rep.</span>
        );
    };

    const TipRow = ({ tip }) => {
        const tipComments = comments.filter(c => c.tipId === tip.id);
        const tipReports = reports.filter(r => r.tipId === tip.id);
        const expanded = expandedTip === tip.id;

        return (
            <div style={{ border: '1px solid #f3f4f6', borderRadius: '10px', overflow: 'hidden', marginBottom: '10px' }}>
                <div style={{ padding: '14px 16px', background: 'white', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <div style={{ width: '12px', height: '40px', borderRadius: '4px', backgroundColor: tip.color, flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: '140px' }}>
                        <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{tip.title}</div>
                        <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '2px' }}>{t('modBy')}: {tip.authorName || t('anonymous')} • {tip.category}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <ReportBadge tipId={tip.id} count={tip.reportsCount} />
                        {tip.isSuspended && <span style={{ padding: '3px 10px', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 700, background: '#fee2e2', color: '#ef4444' }}>{t('tipSuspended')}</span>}
                        <button onClick={() => setExpandedTip(expanded ? null : tip.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem' }}>
                            <MessageSquare size={14} /> {tipComments.length}
                            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                        {tip.isSuspended && (
                            <button onClick={() => restoreTip(tip.id)} className="btn btn-outline btn-sm" title={t('modRestoreBtn')}>
                                <RefreshCcw size={13} /> {t('modRestoreBtn')}
                            </button>
                        )}
                        <button onClick={() => setEditingTip(tip)} className="btn btn-ghost btn-sm" title={t('editTip')}>
                            <Edit2 size={13} />
                        </button>
                        <button
                            onClick={() => {
                                const reason = window.prompt(t('modPromptDelete'), t('modDefaultReason'));
                                if (reason) moderatorDeleteTip(tip.id, reason);
                            }}
                            className="btn btn-danger btn-sm" title={t('deleteForMod')}
                        >
                            <Trash2 size={13} />
                        </button>
                    </div>
                </div>

                {expanded && (
                    <div style={{ background: '#fafafa', borderTop: '1px solid #f3f4f6', padding: '16px' }}>

                        {/* Reports Section */}
                        {tipReports.length > 0 && (
                            <div style={{ marginBottom: '20px' }}>
                                <div style={{ fontSize: '0.8rem', color: '#ef4444', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Flag size={14} /> {t('modEvidence')} ({tipReports.length})
                                </div>
                                <div style={{ display: 'grid', gap: '8px' }}>
                                    {tipReports.map(r => (
                                        <div key={r.id} style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px 14px' }}>
                                            <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#991b1b', marginBottom: '4px' }}>{t('modReason')} {r.reason}</div>
                                            {r.details && <div style={{ fontSize: '0.8rem', color: '#7f1d1d', fontStyle: 'italic' }}>"{r.details}"</div>}
                                            <div style={{ fontSize: '0.7rem', color: '#b91c1c', marginTop: '6px', opacity: 0.8 }}>
                                                {t('modSentOn')} {new Date(r.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Comments Section */}
                        <div style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <MessageSquare size={14} /> {t('modComments')} ({tipComments.length})
                        </div>
                        {tipComments.length === 0 ? (
                            <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>{t('modNoComments')}</div>
                        ) : (
                            tipComments.map(c => (
                                <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', border: '1px solid #f3f4f6', borderRadius: '8px', padding: '10px 12px', marginBottom: '6px' }}>
                                    <div>
                                        <span style={{ fontWeight: 700, fontSize: '0.8rem', color: '#374151' }}>{c.authorName}: </span>
                                        <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>{c.text}</span>
                                    </div>
                                    <button onClick={() => deleteComment(c.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: '4px', transition: 'color 0.15s' }}
                                        onMouseOver={e => e.currentTarget.style.color = '#ef4444'}
                                        onMouseOut={e => e.currentTarget.style.color = '#9ca3af'}
                                    >
                                        <Trash2 size={13} />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="dashboard-container">
            {/* Header Card */}
            <div className="card" style={{ margin: '20px 0 24px', overflow: 'hidden' }}>
                {/* Dark banner */}
                <div style={{
                    background: 'var(--grey-900)',
                    padding: '20px 24px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    position: 'relative',
                    overflow: 'hidden',
                }}>
                    <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 80% 50%, rgba(124,58,237,0.2) 0%, transparent 60%)', pointerEvents: 'none' }} />
                    <div style={{ background: 'rgba(124,58,237,0.25)', color: '#c4b5fd', padding: '10px', borderRadius: '12px', display: 'flex', flexShrink: 0, zIndex: 1 }}>
                        <Shield size={24} />
                    </div>
                    <div style={{ zIndex: 1 }}>
                        <h2 style={{ margin: 0, fontWeight: 800, fontSize: '1.1rem', color: '#fff' }}>{t('modDashboardTitle')}</h2>
                        <p style={{ margin: 0, color: 'var(--grey-400)', fontSize: '0.8rem' }}>{t('modHello')}, {user.name} :)</p>
                    </div>
                </div>

                {/* Stats grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))',
                    gap: '1px',
                    background: 'var(--border)',
                    borderTop: '1px solid var(--border)',
                }}>
                    {[
                        { label: t('modTotalTips'), value: tips.length, color: 'var(--text-primary)' },
                        { label: t('modReported'), value: reportedTips.length, color: '#f59e0b' },
                        { label: t('modReports'), value: reports.length, color: 'var(--danger)' },
                        { label: t('modSuspended'), value: tips.filter(t => t.isSuspended).length, color: '#dc2626' },
                        { label: t('modComments'), value: comments.length, color: 'var(--text-secondary)' },
                    ].map(s => (
                        <div key={s.label} style={{ textAlign: 'center', padding: '16px 8px', background: 'var(--surface)' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
                            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '4px' }}>{s.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tabs */}
            <div style={{ overflowX: 'auto', marginBottom: '20px', paddingBottom: '2px' }}>
                <div style={{ display: 'flex', gap: '4px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '4px', width: 'max-content', minWidth: '100%' }}>
                    {[['reported', `${t('modTabReported')} (${reportedTips.length})`], ['all', `${t('modTabAll')} (${tips.length})`], ['comments', `${t('modTabComments')} (${comments.length})`]].map(([key, label]) => (
                        <button
                            key={key}
                            onClick={() => setActiveTab(key)}
                            style={{
                                padding: '8px 16px', borderRadius: 'var(--radius-sm)', border: 'none', cursor: 'pointer',
                                background: activeTab === key ? 'var(--grey-900)' : 'transparent',
                                color: activeTab === key ? '#fff' : 'var(--text-secondary)',
                                fontWeight: 700, fontSize: '0.825rem',
                                boxShadow: activeTab === key ? 'var(--shadow-sm)' : 'none',
                                transition: 'all 0.15s', whiteSpace: 'nowrap',
                                fontFamily: "'Plus Jakarta Sans', sans-serif",
                            }}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tips list */}
            {activeTab !== 'comments' && (
                currentList.length === 0 ? (
                    <div className="card" style={{ padding: '48px', textAlign: 'center', color: '#9ca3af' }}>
                        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
                            <CheckCircle2 size={48} color="#10b981" opacity={0.5} />
                        </div>
                        <p>{activeTab === 'reported' ? t('modNoTipsReported') : t('modNoTipsAll')}</p>
                    </div>
                ) : (
                    <div>{currentList.map(tip => <TipRow key={tip.id} tip={tip} />)}</div>
                )
            )}

            {/* Comments Tab */}
            {activeTab === 'comments' && (
                <div className="card">
                    {allComments.length === 0 ? (
                        <div style={{ padding: '48px', textAlign: 'center', color: '#9ca3af' }}>{t('modNoComments')}</div>
                    ) : (
                        allComments.map(c => {
                            const tip = tips.find(t => t.id === c.tipId);
                            return (
                                <div key={c.id} style={{ padding: '14px 20px', borderBottom: '1px solid #f9fafb', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '0.82rem', color: '#374151', marginBottom: '4px' }}>
                                            <strong>{c.authorName}</strong>: {c.text}
                                        </div>
                                        <div style={{ fontSize: '0.72rem', color: '#9ca3af' }}>
                                            {t('modIn')}: {tip ? `"${tip.title}"` : t('modDeletedTip')} · {new Date(c.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <button onClick={() => deleteComment(c.id)} className="btn btn-danger btn-sm" title={t('deleteForMod')}>
                                        <Trash2 size={13} />
                                    </button>
                                </div>
                            );
                        })
                    )}
                </div>
            )}

            {editingTip && <EditTipModal tip={editingTip} onClose={() => setEditingTip(null)} asModerator />}
        </div>
    );
}
