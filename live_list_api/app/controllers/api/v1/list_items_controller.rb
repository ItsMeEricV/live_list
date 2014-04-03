class API::V1::ListItemsController < ApplicationController

  # GET /list_items
  def index
    @list_items = ListItem.all
    render json: @list_items
  end

  # POST /list_item
  def create
    @list_item = ListItem.new(list_item_params)

    #render json: @list_item

    if @list_item.save

      #firehose pub
      json = @list_item.to_json
      firehose = Firehose::Client::Producer::Http.new('//127.0.0.1:7474')
      firehose.publish(json).to("/live_list")

      render json: @list_item, status: :created
    else
      render json: @list_item.errors, status: :unprocessable_entity
    end
  end



  private

    # Never trust parameters from the scary internet, only allow the white list through.
    def list_item_params
      params.permit(:index, :title, :list_type, :list_id)
    end


end
