const STAGE_1 = ['046', '035', '036', '044', '023'];
const STAGE_2 = ['047', '048', '049', '582', '583', '584', '585', '586', '587', '588', '589', '590', '591'];
const STAGE_3 = ['050', '051', '054', '055', '053'];
const STAGE_4 = ['564', '580', '501', '505', '508', '510'];

const STAGE_1_TITLE = 'DESCENT OF LIGHT & PROMISE';
const STAGE_2_TITLE = 'THE NEW CREATION';
const STAGE_3_TITLE = 'THE FUTURE & SUPERHUMANITY';
const STAGE_4_TITLE = 'IMMORTALITY & DIVINE MANIFESTATION';

export function filterNewCreation(database, selectedQuality) {
  if (!database) return [];

  const sq = (selectedQuality || '').toLowerCase();

  let targetIds = null;
  let singleStageTitle = null;

  if (sq.includes('descent') || sq.includes('promise') || sq.includes('stage 1')) {
    targetIds = STAGE_1;
    singleStageTitle = STAGE_1_TITLE;
  } else if (sq.includes('auroville') || sq.includes('stage 2')) {
    targetIds = STAGE_2;
    singleStageTitle = STAGE_2_TITLE;
  } else if (sq.includes('future') || sq.includes('superhumanity') || sq.includes('stage 3')) {
    targetIds = STAGE_3;
    singleStageTitle = STAGE_3_TITLE;
  } else if (sq.includes('immortality') || sq.includes('stage 4')) {
    targetIds = STAGE_4;
    singleStageTitle = STAGE_4_TITLE;
  }

  if (targetIds) {
    return database.filter(f => {
      const fid = String(f.id).padStart(3, '0');
      const fidClean = String(f.id).replace(/^0+/, '');
      return targetIds.includes(fid) || targetIds.includes(fidClean);
    }).map((f, idx) => ({
      ...f,
      section_title: idx === 0 ? singleStageTitle : null
    })).sort((a, b) => {
      const fidA = String(a.id).padStart(3, '0');
      const fidB = String(b.id).padStart(3, '0');
      return targetIds.indexOf(fidA) - targetIds.indexOf(fidB);
    });
  }

  const progressiveOrder = [...STAGE_1, ...STAGE_2, ...STAGE_3, ...STAGE_4];
  const orderMap = new Map(progressiveOrder.map((id, idx) => [id, idx]));

  const matches = database.filter(f => {
    const fid = String(f.id).padStart(3, '0');
    const fidClean = String(f.id).replace(/^0+/, '');
    const name = (f.mothers_name || '').toLowerCase();
    return orderMap.has(fid) || orderMap.has(fidClean) || name.includes('descent of light') || name.includes('new creation') || name.includes('new world');
  }).sort((a, b) => {
    const fidA = String(a.id).padStart(3, '0');
    const fidB = String(b.id).padStart(3, '0');
    const rankA = orderMap.has(fidA) ? orderMap.get(fidA) : 999;
    const rankB = orderMap.has(fidB) ? orderMap.get(fidB) : 999;
    if (rankA !== rankB) return rankA - rankB;
    return (a.mothers_name || '').localeCompare(b.mothers_name || '');
  });

  const firstS1 = STAGE_1[0];
  const firstS2 = STAGE_2[0];
  const firstS3 = STAGE_3[0];
  const firstS4 = STAGE_4[0];

  return matches.map(f => {
    const fid = String(f.id).padStart(3, '0');
    let header = null;
    if (fid === firstS1) header = STAGE_1_TITLE;
    else if (fid === firstS2) header = STAGE_2_TITLE;
    else if (fid === firstS3) header = STAGE_3_TITLE;
    else if (fid === firstS4) header = STAGE_4_TITLE;

    return {
      ...f,
      section_title: header
    };
  });
}
