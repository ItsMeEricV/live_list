class API::V1::ListItemsController < ApplicationController

  # GET /list_items
  def index
    @list_items = ListItem.all
    render json: @list_items
  end

  # POST /lists/:list_id
  def create
    @list = List.find(params[:list_id])
    #@list.list_items_attributes = [ { title: "Title here", index: 0, order: 1, list_type: "item" } ]
    #@list.list_items_attributes = [ list_item_params ]
    @list_item = @list.list_items.build(list_item_params)

    if @list.save

      #firehose pub
      @list_item["cid"] = params[:cid]
      json = @list_item.to_json
      firehose = Firehose::Client::Producer::Http.new('//127.0.0.1:7474')
      firehose.publish(json).to("/live_list")

      render json: @list_item, status: :created
    else
      render json: @list.errors, status: :unprocessable_entity
    end
  end

  # PATCH /list/:list_id/:list_item_id
  def update

    @list = List.find(params[:list_id])
    p = list_item_params

    # hack to not update the "selected" attribute in the DB, just communicate it to the clients
    if(params[:selected])
      message = {cid: params[:cid], action: "select", id: params[:list_item_id]}
      json = message.to_json
      firehose = Firehose::Client::Producer::Http.new('//127.0.0.1:7474')
      firehose.publish(json).to("/live_list")
    else
      p[:id] = params[:list_item_id]
      @list.list_items_attributes = [p]
      
      if @list.save
        p[:cid] = params[:cid]
        p[:action] = "update"
        json = p.to_json
        firehose = Firehose::Client::Producer::Http.new('//127.0.0.1:7474')
        firehose.publish(json).to("/live_list")



        render json: p, status: :created
      else
        render json: {response: "error"}, status: :unprocessable_entity
      end
    end


  end

  private

    # Never trust parameters from the scary internet, only allow the white list through.
    def list_item_params
      params.permit(:index, :order, :title, :list_type, :id)
    end


end
