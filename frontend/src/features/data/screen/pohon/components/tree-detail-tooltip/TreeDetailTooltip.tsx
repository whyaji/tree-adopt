import moment from 'moment';

import { TreeType } from '@/types/tree.type';

export function TreeDetailTooltip({ tree }: { tree: TreeType }) {
  const survey = tree.survey;
  if (!survey) {
    return <div className="text-center">No survey data available</div>;
  }

  const images = [
    survey.treeImage,
    survey.leafImage ?? [],
    survey.fruitImage ?? [],
    survey.flowerImage ?? [],
    survey.sapImage ?? [],
    survey.otherImage ?? [],
  ].flat();

  return (
    <div className="flex flex-col gap-2">
      <div>
        <div>
          <strong>Surveyor:</strong> {survey.userId}
        </div>
        <div>
          <strong>Survey Terakhir:</strong> {moment(survey.surveyDate).format('DD MMM YYYY')}{' '}
          {survey.surveyTime}
        </div>
      </div>
      {/* list image in row */}
      <div className="flex flex-wrap gap-2">
        {images.map((image, index) => (
          <img
            key={index}
            src={'/thumbnails' + image}
            alt={`Survey Image ${index + 1}`}
            className="w-24 h-24 object-cover rounded"
          />
        ))}
      </div>
    </div>
  );
}
