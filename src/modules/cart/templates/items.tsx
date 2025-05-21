import repeat from "@lib/util/repeat"
import { HttpTypes } from "@medusajs/types"
import { Heading, Table } from "@medusajs/ui"

import Item from "@modules/cart/components/item"
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"

type ItemsTemplateProps = {
  cart?: HttpTypes.StoreCart
}

const ItemsTemplate = ({ cart }: ItemsTemplateProps) => {
  const items = cart?.items
  return (
    <div className="bg-[#FFF9EF] p-6 rounded-md shadow-md border border-[#e3d5bc]">
      <div className="pb-4 flex items-center">
        <Heading className="text-[2rem] leading-[2.75rem] text-[#1a1a1a]">
          Carrito
        </Heading>
      </div>

    <Table className="text-[#1a1a1a] border border-[#e3d5bc] rounded-md overflow-hidden">
  <Table.Header className="border-b border-[#e3d5bc] bg-[#FFF5E5]">
    <Table.Row className="text-[#5a5243] font-semibold uppercase text-sm tracking-wide">
      <Table.HeaderCell className="!pl-4 py-3 bg-[#FFF5E5]">Producto</Table.HeaderCell>
      <Table.HeaderCell className="bg-[#FFF5E5]"></Table.HeaderCell>
      <Table.HeaderCell className="bg-[#FFF5E5]">Cantidad</Table.HeaderCell>
      <Table.HeaderCell className="hidden small:table-cell bg-[#FFF5E5]">Precio</Table.HeaderCell>
      <Table.HeaderCell className="!pr-4 text-right bg-[#FFF5E5]">Total</Table.HeaderCell>
    </Table.Row>
  </Table.Header>

  <Table.Body className="bg-[#FFF9EF] divide-y divide-[#e3d5bc] [&_td]:bg-[#FFF9EF]">
    {items
      ? items
          .sort((a, b) => {
            return (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
          })
          .map((item) => (
            <Item
              key={item.id}
              item={item}
              currencyCode={cart?.currency_code}
            />
          ))
      : repeat(5).map((i) => <SkeletonLineItem key={i} />)}
  </Table.Body>
</Table>

    </div>
  )
}

export default ItemsTemplate
