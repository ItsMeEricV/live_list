class API::V1::ListItemsController < ApplicationController

  # GET /list_items
  def index
    @list_items = ListItem.all
    render json: @list_items
  end

  # POST /list_item
  def create
    @list = List.find(params[:list_id])
    #@list.list_items_attributes = [ { title: "Title here", index: 0, order: 1, list_type: "item" } ]
    #@list.list_items_attributes = [ list_item_params ]
    @list_item = @list.list_items.build(list_item_params)

    if @list.save

      #firehose pub
      json = @list_item.to_json
      firehose = Firehose::Client::Producer::Http.new('//127.0.0.1:7474')
      firehose.publish(json).to("/live_list")

      render json: @list_item, status: :created
    else
      render json: @list.errors, status: :unprocessable_entity
    end
  end



  private

    # Never trust parameters from the scary internet, only allow the white list through.
    def list_item_params
      params.permit(:index, :order, :title, :list_type)
    end


end
