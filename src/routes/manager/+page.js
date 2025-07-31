import { redirect } from '@sveltejs/kit';
import { managers as managersObj } from '$lib/utils/helper';

export function load({ url }) {
  // read ?manager=N (default to 0)
  const param = Number(url.searchParams.get('manager'));
  const idx = Number.isInteger(param) && param >= 0 && param < managersObj.length
    ? param
    : 0;

  // redirect to /managers/0, /managers/1, etc.
  throw redirect(307, `/manager/${idx}`);
}