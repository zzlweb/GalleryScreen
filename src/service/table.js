import request from '@/utils/request';

export function queryList() {
  return request('/api/tables');
}

export function deleteOne(id) {
  return request(`/api/tables/${id}`, {
    method: 'DELETE',
  });
}

export function addOne(data) {
  return request('/api/tables/add', {
    headers: {
      'content-type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function getStatistic(id) {
  return request(`/api/tables/${id}/statistic`);
}
