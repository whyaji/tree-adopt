import Cookies from 'js-cookie';

import { PaginationParams } from '@/interface/pagination.interface';
import { SurveyHistoryType } from '@/types/surveyHistory.type';

import { api, baseApiUrl } from './api';

const surveyHistoryApi = api['survey-history'];

const authToken = Cookies.get('auth_token');

export async function createSurveyHistory(formData: FormData) {
  const res = await fetch(`${baseApiUrl}/survey-history`, {
    method: 'POST',
    body: formData,
    headers: {
      Authorization: authToken ? `Bearer ${authToken}` : '',
    },
  });
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}

export async function getSurveyHistories({
  search,
  page,
  limit,
  filter,
  withData,
  sortBy,
  order,
}: PaginationParams) {
  const res = await surveyHistoryApi.$get({
    query: { search, page, limit, with: withData, filter, sortBy, order },
  });
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}

export async function getSurveyHistory(id: string, withData?: string) {
  const res = await surveyHistoryApi[':id{[0-9]+}'].$get({
    param: { id },
    ...(withData ? { query: { with: withData } } : {}),
  });
  if (!res.ok) throw new Error(res.statusText);
  return res.json() as Promise<{ data: SurveyHistoryType }>;
}

export async function updateSurveyHistory(id: number, formData: FormData) {
  const res = await fetch(`${baseApiUrl}/survey-history/${id}`, {
    method: 'PUT',
    body: formData,
    headers: {
      Authorization: authToken ? `Bearer ${authToken}` : '',
    },
  });
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}

export async function deleteSurveyHistory(id: string) {
  const res = await surveyHistoryApi[':id{[0-9]+}'].$delete({
    param: { id },
  });
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}
