# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :list_item do
    index 1
    order 0
    title "Great list item"
    list_type "item"

    factory :list_item2 do
      index 2
      order 1
      title "Another great list item"
    end

    factory :list_item3 do
      index 3
      order 2
      title "Truck wheels"
    end
  end
end
