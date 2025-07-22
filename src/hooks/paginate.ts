import type { Ref } from 'vue'
import { computed, ref, unref } from 'vue'

function paginate<T = any>(list: T[], pageNo: number, pageSize: number): T[] {
  const offset = (pageNo - 1) * Number(pageSize)
  return offset + Number(pageSize) >= list.length
    ? list.slice(offset, list.length)
    : list.slice(offset, offset + Number(pageSize))
}

export function usePaginateHook<T = any>(list: Ref<T[]>, pageSize: number) {
  const currentPage = ref(1)
  const pageSizeRef = ref(pageSize)

  const paginates = computed(() => {
    return paginate(unref(list), unref(currentPage), unref(pageSizeRef))
  })

  const total = computed(() => {
    return unref(list).length
  })

  function setCurrentPage(page: number) {
    currentPage.value = page
  }

  function setPageSize(pageSize: number) {
    pageSizeRef.value = pageSize
  }

  return { setCurrentPage, total, setPageSize, paginates }
}

export default usePaginateHook
