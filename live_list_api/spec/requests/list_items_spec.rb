require 'spec_helper'

describe "List Items" do

  before(:each) do

    list_item = FactoryGirl.create(:list_item)
    list_item2 = FactoryGirl.create(:list_item2)
    list_item3 = FactoryGirl.create(:list_item3)

  end

  describe "GET /list_items" do

  end

  describe "POST /list/:list_id/:list_item_id" do

    it "should add a list item and return the new list item" do
      pending
    end


  end