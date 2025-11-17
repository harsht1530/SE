import React, { useMemo } from 'react';
import useFilterTerms  from '../CustomHooks/useFilterTerms';

const HighlightedText = React.memo(({ text }) => {
  const filterTerms = useFilterTerms();

  const highlightedContent = useMemo(() => {
    if (!filterTerms.length || !text) return text;

    const escapedTerms = filterTerms
      .map(term => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

    const regex = new RegExp(`(${escapedTerms.join('|')})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, i) =>
      filterTerms.some(term => term.toLowerCase() === part.toLowerCase()) ? (
        <strong key={i} className="bg-yellow-200">{part}</strong>
      ) : part
    );
  }, [text, filterTerms]);

  return <span>{highlightedContent}</span>;
});

export default HighlightedText;